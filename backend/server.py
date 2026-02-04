from fastapi import FastAPI, HTTPException, Body, Depends, APIRouter, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timedelta
import json
from database import get_db_connection

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Helper for SQLite async interaction (running in threadpool)
import asyncio
from concurrent.futures import ThreadPoolExecutor
executor = ThreadPoolExecutor(max_workers=5)

async def run_query(query, params=(), fetchone=False, fetchall=False):
    loop = asyncio.get_event_loop()
    def _run():
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        if fetchone:
            res = cursor.fetchone()
            return dict(res) if res else None
        if fetchall:
            res = cursor.fetchall()
            return [dict(row) for row in res]
        conn.commit()
        conn.close()
    return await loop.run_in_executor(executor, _run)


# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize and seed DB if needed
    try:
        from database import init_db
        from seed_db import seed
        
        # Initialize tables
        init_db()
        
        # Check if products exist, if not seed the DB
        # This handles ephemeral filesystems (like Render) where DB might be fresh on restart
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM products")
        count = cursor.fetchone()[0]
        conn.close()
        
        if count == 0:
            logger.info("Database empty, seeding initial data...")
            seed()
            logger.info("Database seeded successfully!")
            
    except Exception as e:
        logger.error(f"Error during startup: {e}")
        
    yield
    # Shutdown
    client.close()

# Create the main app
app = FastAPI(lifespan=lifespan)

# Database Dependency
def get_db():
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()

# Setup MongoDB
class MongoManager:
    def __init__(self):
        self.client = AsyncIOMotorClient(os.environ['MONGO_URL'])
        self.db = self.client[os.environ['DB_NAME']]

    def get_collection(self, name: str):
        return self.db[name]

    async def close(self):
        self.client.close()

mongo_manager = MongoManager()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ MODELS ============

class Category(BaseModel):
    id: int
    name: str
    image: str
    link: str

class Product(BaseModel):
    id: int
    title: str
    price: float
    originalPrice: float
    rating: float
    reviewCount: int
    image: str
    isPrime: bool
    category: str
    inStock: bool
    brand: Optional[str] = None
    about: Optional[List[str]] = []
    specs: Optional[Dict[str, str]] = {}
    offers: Optional[List[Dict[str, str]]] = []

class DealProduct(BaseModel):
    id: int
    title: str
    price: float
    originalPrice: float
    discount: int
    image: str
    rating: float
    reviewCount: int

class Deal(BaseModel):
    id: int
    title: str
    product: DealProduct
    endsAt: str
    claimed: Optional[int] = None

class HeroSlide(BaseModel):
    id: int
    image: str
    title: str
    link: str
    backgroundColor: str

class GridCard(BaseModel):
    id: int
    title: str
    link_text: str
    link_url: str
    display_order: int
    items: List[dict]

class FooterLinks(BaseModel):
    getToKnowUs: List[dict]
    makeMoneyWithUs: List[dict]
    amazonPaymentProducts: List[dict]
    letUsHelpYou: List[dict]

class CartItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: int
    quantity: int
    session_id: str

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    session_id: str

class OrderItem(BaseModel):
    id: str
    order_id: str
    product_id: int
    product_snapshot: dict
    quantity: int
    unit_price: float
    total_price: float

class Order(BaseModel):
    id: str
    order_number: str
    user_id: str
    status: str
    subtotal: float
    tax: float
    shipping_fee: float
    discount: float
    total: float
    shipping_address: Optional[dict] = None
    created_at: str
    delivered_at: Optional[str] = None
    items: Optional[List[OrderItem]] = []

# Helper to parse JSON fields from SQLite
def parse_product(p):
    if not p: return None
    p['about'] = json.loads(p['about']) if p.get('about') else []
    p['specs'] = json.loads(p['specs']) if p.get('specs') else {}
    p['offers'] = json.loads(p['offers']) if p.get('offers') else []
    p['isPrime'] = bool(p['isPrime'])
    p['inStock'] = bool(p['inStock'])
    return p


@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all product categories"""
    return await run_query("SELECT * FROM categories", fetchall=True)

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    """Get all products, optionally filtered by category"""
    if category and category != "All":
        rows = await run_query("SELECT * FROM products WHERE LOWER(category) = LOWER(?)", (category,), fetchall=True)
    else:
        rows = await run_query("SELECT * FROM products", fetchall=True)
    return [parse_product(row) for row in rows]




FOOTER_LINKS = {
    "getToKnowUs": [
        {"label": "Careers", "link": "/careers"},
        {"label": "Blog", "link": "/blog"},
        {"label": "About Amazon", "link": "/about"},
        {"label": "Investor Relations", "link": "/investors"},
        {"label": "Amazon Devices", "link": "/devices"},
        {"label": "Amazon Science", "link": "/science"}
    ],
    "makeMoneyWithUs": [
        {"label": "Sell products on Amazon", "link": "/sell"},
        {"label": "Sell on Amazon Business", "link": "/business"},
        {"label": "Sell apps on Amazon", "link": "/apps"},
        {"label": "Become an Affiliate", "link": "/affiliate"},
        {"label": "Advertise Your Products", "link": "/advertise"},
        {"label": "Self-Publish with Us", "link": "/publish"}
    ],
    "amazonPaymentProducts": [
        {"label": "Amazon Business Card", "link": "/business-card"},
        {"label": "Shop with Points", "link": "/points"},
        {"label": "Reload Your Balance", "link": "/reload"},
        {"label": "Amazon Currency Converter", "link": "/currency"}
    ],
    "letUsHelpYou": [
        {"label": "Amazon and COVID-19", "link": "/covid"},
        {"label": "Your Account", "link": "/account"},
        {"label": "Your Orders", "link": "/orders"},
        {"label": "Shipping Rates & Policies", "link": "/shipping"},
        {"label": "Returns & Replacements", "link": "/returns"},
        {"label": "Manage Your Content", "link": "/content"},
        {"label": "Help", "link": "/help"}
    ]
}

# ============ ROUTES ============

@api_router.get("/")
async def root():
    return {"message": "Amazon Clone API"}

@api_router.get("/hero-slides", response_model=List[HeroSlide])
async def get_hero_slides():
    """Get hero carousel slides"""
    return await run_query("SELECT * FROM hero_slides", fetchall=True)

@api_router.get("/orders/{user_id}", response_model=List[Order])
async def get_user_orders(user_id: str):
    """Get all orders for a user with order items"""
    # Get all orders for the user
    orders = await run_query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        (user_id,),
        fetchall=True
    )
    
    # For each order, fetch its items
    for order in orders:
        # Parse shipping address JSON
        if order.get('shipping_address'):
            order['shipping_address'] = json.loads(order['shipping_address'])
        
        # Fetch order items
        order_items = await run_query(
            "SELECT * FROM order_items WHERE order_id = ?",
            (order['id'],),
            fetchall=True
        )
        
        # Parse product snapshots
        for item in order_items:
            if item.get('product_snapshot'):
                item['product_snapshot'] = json.loads(item['product_snapshot'])
        
        order['items'] = order_items
    
    return orders

@api_router.get("/products/search", response_model=List[Product])
async def search_products(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query("All", description="Category filter")
):
    """Search products by query and category"""
    query = "SELECT * FROM products WHERE 1=1"
    params = []
    
    if category and category != "All":
        cat_lower = category.lower().replace(" ", "-").replace("&", "")
        query += " AND category LIKE ?"
        params.append(f"%{cat_lower}%")
    
    if q:
        query_lower = f"%{q.lower()}%"
        query += " AND (LOWER(title) LIKE ? OR LOWER(category) LIKE ?)"
        params.extend([query_lower, query_lower])
    
    rows = await run_query(query, tuple(params), fetchall=True)
    return [parse_product(row) for row in rows]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """Get a single product by ID"""
    row = await run_query("SELECT * FROM products WHERE id = ?", (product_id,), fetchone=True)
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return parse_product(row)

@api_router.get("/deals")
async def get_deals_endpoint():
    """Get current deals (Mocking the dynamic part for now)"""
    # For now, we reuse the dynamic deal generator but we could also fetch basic deal info from DB
    def get_deals():
        return [
            {
                "id": 1,
                "title": "Deal of the Day",
                "product": {
                    "id": 101,
                    "title": "Fire TV Stick 4K Max streaming device",
                    "price": 34.99,
                    "originalPrice": 59.99,
                    "discount": 42,
                    "image": "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=400&fit=crop",
                    "rating": 4.6,
                    "reviewCount": 234567
                },
                "endsAt": (datetime.utcnow() + timedelta(hours=8)).isoformat()
            }
        ]
    return get_deals()

@api_router.get("/hero-slides", response_model=List[HeroSlide])
async def get_hero_slides(db=Depends(get_db)):
    """Get hero carousel slides"""
    cursor = db.execute("SELECT * FROM hero_slides")
    slides = []
    for row in cursor.fetchall():
        slides.append(dict(row))
    return slides

@api_router.get("/grid-cards", response_model=List[GridCard])
async def get_grid_cards(db=Depends(get_db)):
    """Get home page grid cards"""
    cursor = db.execute("SELECT * FROM grid_cards ORDER BY display_order ASC")
    cards = []
    for row in cursor.fetchall():
        card = dict(row)
        # Parse items JSON
        try:
            card['items'] = json.loads(card['items'])
        except:
            card['items'] = []
        cards.append(card)
    return cards

@api_router.get("/search-categories", response_model=List[str])
async def get_search_categories():
    """Get all search categories"""
    # Define explicitly or could fetch from a distinct category list
    return [
        "All", "Electronics", "Computers", "Smart Home", "Arts & Crafts", 
        "Automotive", "Baby", "Beauty & Personal Care", "Books", "Fashion",
        "Health & Household", "Home & Kitchen", "Industrial & Scientific",
        "Kindle Store", "Movies & TV", "Music", "Pet Supplies", 
        "Sports & Outdoors", "Tools & Home Improvement", "Toys & Games"
    ]

@api_router.get("/footer-links", response_model=FooterLinks)
async def get_footer_links():
    """Get footer links"""
    return FOOTER_LINKS

# Cart endpoints (using MongoDB for persistence)
@api_router.post("/cart")
async def add_to_cart(item: CartItemCreate):
    """Add item to cart"""
    existing = await db.cart.find_one({
        "product_id": item.product_id,
        "session_id": item.session_id
    })
    
    if existing:
        await db.cart.update_one(
            {"_id": existing["_id"]},
            {"$inc": {"quantity": item.quantity}}
        )
    else:
        cart_item = {
            "id": str(uuid.uuid4()),
            "product_id": item.product_id,
            "quantity": item.quantity,
            "session_id": item.session_id,
            "created_at": datetime.utcnow()
        }
        await db.cart.insert_one(cart_item)
    
    return {"message": "Added to cart"}

@api_router.get("/cart/{session_id}")
async def get_cart(session_id: str):
    """Get cart items for a session"""
    cart_items = await db.cart.find({"session_id": session_id}).to_list(100)
    
    result = []
    for item in cart_items:
        product = next((p for p in PRODUCTS if p["id"] == item["product_id"]), None)
        if product:
            result.append({
                **product,
                "quantity": item["quantity"],
                "cart_id": item["id"]
            })
    
    return result

@api_router.delete("/cart/{session_id}/{product_id}")
async def remove_from_cart(session_id: str, product_id: int):
    """Remove item from cart"""
    await db.cart.delete_one({
        "session_id": session_id,
        "product_id": product_id
    })
    return {"message": "Removed from cart"}

@api_router.delete("/cart/{session_id}")
async def clear_cart(session_id: str):
    """Clear all items from cart"""
    await db.cart.delete_many({"session_id": session_id})
    return {"message": "Cart cleared"}

@api_router.put("/cart/{session_id}/{product_id}")
async def update_cart_quantity(session_id: str, product_id: int, quantity: int = Query(...)):
    """Update cart item quantity"""
    if quantity <= 0:
        await db.cart.delete_one({
            "session_id": session_id,
            "product_id": product_id
        })
    else:
        await db.cart.update_one(
            {"session_id": session_id, "product_id": product_id},
            {"$set": {"quantity": quantity}}
        )
    return {"message": "Cart updated"}

# ============ REVIEWS ENDPOINTS ============

class ReviewCreate(BaseModel):
    rating: int
    title: str
    content: str
    user_name: str
    user_id: str

class HelpfulRequest(BaseModel):
    helpful: bool

# Mock reviews data for initial display
MOCK_REVIEWS = {
    1: [
        {
            "id": "rev_1",
            "product_id": 1,
            "rating": 5,
            "title": "Best wireless earbuds I've ever owned!",
            "content": "The noise cancellation is incredible. Battery life is amazing, and they're so comfortable I can wear them for hours. The spatial audio feature is mind-blowing for movies and music.",
            "user_name": "AudioEnthusiast",
            "user_id": "user_mock_1",
            "created_at": "2025-06-15T10:30:00Z",
            "verified_purchase": True,
            "helpful_count": 234
        },
        {
            "id": "rev_2",
            "product_id": 1,
            "rating": 4,
            "title": "Great but pricey",
            "content": "Sound quality is top-notch and the ANC is impressive. Only giving 4 stars because of the price point. Would recommend waiting for a sale.",
            "user_name": "TechReviewer",
            "user_id": "user_mock_2",
            "created_at": "2025-06-10T15:45:00Z",
            "verified_purchase": True,
            "helpful_count": 156
        },
        {
            "id": "rev_3",
            "product_id": 1,
            "rating": 5,
            "title": "Perfect for work from home",
            "content": "These have been a game changer for my video calls. The transparency mode is great for hearing my doorbell, and the noise cancellation blocks out my neighbor's construction.",
            "user_name": "RemoteWorker",
            "user_id": "user_mock_3",
            "created_at": "2025-05-28T09:15:00Z",
            "verified_purchase": True,
            "helpful_count": 89
        }
    ],
    2: [
        {
            "id": "rev_4",
            "product_id": 2,
            "rating": 5,
            "title": "Picture quality is stunning!",
            "content": "This OLED TV delivers incredible contrast and vibrant colors. Perfect blacks and the gaming mode is butter smooth. Worth every penny.",
            "user_name": "MovieBuff",
            "user_id": "user_mock_4",
            "created_at": "2025-06-12T18:20:00Z",
            "verified_purchase": True,
            "helpful_count": 312
        }
    ]
}

@api_router.get("/products/{product_id}/reviews")
async def get_product_reviews(product_id: int):
    """Get reviews for a product"""
    # First check MongoDB for user-submitted reviews
    db_reviews = await db.reviews.find({"product_id": product_id}).sort("created_at", -1).to_list(100)
    
    # Convert MongoDB documents to dict and clean up
    reviews = []
    for review in db_reviews:
        review["id"] = str(review.get("_id", review.get("id")))
        if "_id" in review:
            del review["_id"]
        reviews.append(review)
    
    # Add mock reviews if no user reviews exist
    if product_id in MOCK_REVIEWS:
        reviews.extend(MOCK_REVIEWS[product_id])
    
    return reviews

@api_router.post("/products/{product_id}/reviews")
async def create_review(product_id: int, review: ReviewCreate):
    """Create a new review"""
    review_doc = {
        "id": str(uuid.uuid4()),
        "product_id": product_id,
        "rating": review.rating,
        "title": review.title,
        "content": review.content,
        "user_name": review.user_name,
        "user_id": review.user_id,
        "created_at": datetime.utcnow().isoformat(),
        "verified_purchase": False,
        "helpful_count": 0
    }
    
    await db.reviews.insert_one(review_doc)
    
    # Clean up response
    if "_id" in review_doc:
        del review_doc["_id"]
    
    return review_doc

@api_router.post("/reviews/{review_id}/helpful")
async def mark_review_helpful(review_id: str, request: HelpfulRequest):
    """Mark a review as helpful or not helpful"""
    increment = 1 if request.helpful else -1
    
    # Try to update in MongoDB
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$inc": {"helpful_count": increment}}
    )
    
    if result.modified_count == 0:
        # Review might be a mock review, just return success
        pass
    
    return {"message": "Updated"}

# ============ WISHLIST ENDPOINTS ============

class WishlistItemCreate(BaseModel):
    product_id: int
    session_id: str

@api_router.get("/wishlist/{session_id}")
async def get_wishlist(session_id: str):
    """Get wishlist items for a session"""
    wishlist_items = await db.wishlist.find({"session_id": session_id}).to_list(100)
    
    result = []
    for item in wishlist_items:
        product = next((p for p in PRODUCTS if p["id"] == item["product_id"]), None)
        if product:
            result.append({
                **product,
                "added_at": item.get("added_at")
            })
    
    return result

@api_router.post("/wishlist")
async def add_to_wishlist(item: WishlistItemCreate):
    """Add item to wishlist"""
    existing = await db.wishlist.find_one({
        "product_id": item.product_id,
        "session_id": item.session_id
    })
    
    if not existing:
        wishlist_item = {
            "id": str(uuid.uuid4()),
            "product_id": item.product_id,
            "session_id": item.session_id,
            "added_at": datetime.utcnow().isoformat()
        }
        await db.wishlist.insert_one(wishlist_item)
    
    return {"message": "Added to wishlist"}

@api_router.delete("/wishlist/{session_id}/{product_id}")
async def remove_from_wishlist(session_id: str, product_id: int):
    """Remove item from wishlist"""
    await db.wishlist.delete_one({
        "session_id": session_id,
        "product_id": product_id
    })
    return {"message": "Removed from wishlist"}

# ============ ORDERS ENDPOINTS ============

class OrderCreate(BaseModel):
    id: str
    session_id: str
    items: list
    total: float
    status: str
    shipping_address: dict
    payment_method: str
    created_at: str
    estimated_delivery: str

@api_router.get("/orders/{session_id}")
async def get_orders(session_id: str):
    """Get orders for a session"""
    orders = await db.orders.find({"session_id": session_id}).sort("created_at", -1).to_list(100)
    
    result = []
    for order in orders:
        order_dict = dict(order)
        if "_id" in order_dict:
            del order_dict["_id"]
        result.append(order_dict)
    
    return result

@api_router.post("/orders")
async def create_order(order: OrderCreate):
    """Create a new order"""
    order_doc = order.dict()
    await db.orders.insert_one(order_doc)
    return {"message": "Order created", "order_id": order.id}

@api_router.get("/orders/{session_id}/{order_id}")
async def get_order_details(session_id: str, order_id: str):
    """Get specific order details"""
    order = await db.orders.find_one({
        "session_id": session_id,
        "id": order_id
    })
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if "_id" in order:
        del order["_id"]
    
    return order

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
