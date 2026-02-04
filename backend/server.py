from fastapi import FastAPI, APIRouter, HTTPException, Query
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

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

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

# ============ MOCK DATA ============

CATEGORIES = [
    {
        "id": 1,
        "name": "Electronics",
        "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop",
        "link": "/category/electronics"
    },
    {
        "id": 2,
        "name": "Fashion",
        "image": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop",
        "link": "/category/fashion"
    },
    {
        "id": 3,
        "name": "Home & Kitchen",
        "image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
        "link": "/category/home-kitchen"
    },
    {
        "id": 4,
        "name": "Books",
        "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop",
        "link": "/category/books"
    },
    {
        "id": 5,
        "name": "Sports & Outdoors",
        "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop",
        "link": "/category/sports"
    },
    {
        "id": 6,
        "name": "Beauty & Personal Care",
        "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop",
        "link": "/category/beauty"
    },
    {
        "id": 7,
        "name": "Toys & Games",
        "image": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop",
        "link": "/category/toys"
    },
    {
        "id": 8,
        "name": "Grocery",
        "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop",
        "link": "/category/grocery"
    }
]

PRODUCTS = [
    {
        "id": 1,
        "title": "iPhone 17 Pro 256 GB: 15.93 cm (6.3\") Display with Promotion up to 120Hz, A19 Pro Chip",
        "price": 134900.00,
        "originalPrice": 134900.00,
        "rating": 4.5,
        "reviewCount": 55,
        "image": "/phone.jpg",
        "isPrime": True,
        "category": "electronics",
        "inStock": True,
        "brand": "Apple",
        "about": [
            "UNIBODY DESIGN. FOR EXCEPTIONAL POWER — Heat-forged aluminium unibody enclosure for the most powerful iPhone ever made.",
            "DURABLE CERAMIC SHIELD. FRONT AND BACK — Ceramic Shield protects the back of iPhone 17 Pro Max, making it 4x more resistant to cracks.",
            "THE ULTIMATE PRO CAMERA SYSTEM — With all 48MP rear cameras and 8x optical-quality zoom — the longest zoom ever on an iPhone.",
            "18MP CENTER STAGE FRONT CAMERA — Flexible ways to frame your shot. Smarter group selfies, Dual Capture video for simultaneous front and rear recording.",
            "A19 PRO CHIP. VAPOUR COOLED. LIGHTNING FAST — A19 Pro is the most powerful iPhone chip yet, delivering up to 40% better sustained performance.",
            "BREAKTHROUGH BATTERY LIFE — The unibody design creates massive additional battery capacity, for up to 31 hours of video playback."
        ],
        "specs": {
            "Brand": "Apple",
            "Operating System": "iOS",
            "Memory Storage Capacity": "256 GB",
            "Screen Size": "6.3 Inches",
            "Resolution": "4K",
            "Model Name": "iPhone 17 Pro"
        },
        "offers": [
            {"type": "Bank Offer", "description": "Upto ₹4,000.00 discount on select Credit Cards", "link": "4 offers >"},
            {"type": "Cashback", "description": "Upto ₹4,047.00 cashback as Amazon Pay Balance when you pay with Amazon Pay ICICI Bank Credit Card", "link": "1 offer >"},
            {"type": "No Cost EMI", "description": "Upto ₹7,253.94 interest savings on select Credit Cards", "link": "1 offer >"},
             {"type": "Partner Offer", "description": "Get GST invoice and save up to 28% on business purchases.", "link": "1 offer >"}
        ]
    },
    {
        "id": 2,
        "title": "Apple 35W Dual USB-C Port Power Adapter",
        "price": 5490.00,
        "originalPrice": 5800.00,
        "rating": 4.8,
        "reviewCount": 151,
        "image": "/charger.jpg",
        "isPrime": True,
        "category": "electronics",
        "inStock": True,
        "brand": "Apple",
        "about": [
            "DUAL PORT CHARGING — The 35W Dual USB-C Port Power Adapter allows you to charge two devices at the same time, whether you’re at home, in the office, or on the go.",
            "COMPATIBILITY — Apple recommends using it with MacBook Air. You can also use it with iPhone, iPad, Apple Watch, and AirPods.",
            "GLOBAL USE — Pair this power adapter with the World Travel Adapter Kit to charge in regions around the world.",
            "CABLE SOLD SEPARATELY — Charging cable sold separately."
        ],
        "specs": {
            "Brand": "Apple",
            "Connectivity Technology": "USB",
            "Connector Type": "USB Type C",
            "Wattage": "35 Watts",
            "Input Voltage": "240 Volts"
        },
        "offers": [
             {"type": "Bank Offer", "description": "10% Instant Discount on SBI Credit Card", "link": "2 offers >"},
             {"type": "Cashback", "description": "Flat ₹100 back on Amazon Pay Later", "link": "1 offer >"}
        ]
    },
    {
        "id": 3,
        "title": "Apple AirPods 4 Wireless Earbuds, Bluetooth Headphones, Personalised Spatial...",
        "price": 10999.00,
        "originalPrice": 12900.00,
        "rating": 3.8,
        "reviewCount": 953,
        "image": "/pods.jpg",
        "isPrime": True,
        "category": "electronics",
        "inStock": True,
        "brand": "Apple",
        "about": [
            "PERSONALISED SPATIAL AUDIO — With dynamic head tracking places sound all around you.",
            "SINGLE FIT — Force sensor let you control your entertainment and answer or end calls.",
            "SWEAT AND WATER RESISTANT — For AirPods and charging case.",
            "CHARGING CASE — Lightning Charging Case or MagSafe Charging Case.",
            "LISTENING TIME — Up to 6 hours of listening time."
        ],
        "specs": {
            "Brand": "Apple",
             "Model Name": "AirPods",
            "Colour": "White",
            "Form Factor": "In Ear",
            "Connectivity": "Bluetooth 5.3"
        },
         "offers": [
             {"type": "Cost EMI", "description": "No Cost EMI available", "link": "1 offer >"},
             {"type": "Bank Offer", "description": "5% Instant Discount up to INR 250 on HSBC Cashback Card Credit Card Transactions. Minimum purchase value INR 1000", "link": "1 offer >"}
        ]
    },
    {
        "id": 4,
        "title": "FEDUS USB Male to Female Extension Cable, 5 Meter/16.4Ft 2.0 USB A Male to A Female Cable",
        "price": 569.00,
        "originalPrice": 1499.00,
        "rating": 4.4,
        "reviewCount": 628,
        "image": "/drive.jpg",
        "isPrime": True,
        "category": "electronics",
        "inStock": True,
        "brand": "FEDUS",
        "about": [
            "HIGH PERFORMANCE — This USB 2.0 extension cable extends the connection between a computer or Windows tablet and both USB 2.0 and USB 1.1 peripherals.",
            "DURABILITY — Corrosion-resistant gold-plated connectors.",
            "COMPATIBILITY — Keyboard, Mouse, Printer, Scanner, Camera, Flash Drive, Card Reader, Hard Drive.",
            "LENGTH — 5 Meters / 16.4 Feet long cable."
        ],
        "specs": {
            "Brand": "FEDUS",
            "Connector Type": "USB Type A",
            "Cable Type": "USB",
            "Compatible Devices": "Scanner, PC, Printer",
            "Colour": "Black"
        },
        "offers": []
    },
    {
        "id": 5,
        "title": "ZEBRONICS Fame, 2.0 USB Computer Speakers, 5 Watts, USB Powered, AUX, Volume Control",
        "price": 449.00,
        "originalPrice": 799.00,
        "rating": 3.8,
        "reviewCount": 12621,
        "image": "/speaker.jpg",
        "isPrime": True,
        "category": "electronics",
        "inStock": True,
        "brand": "ZEBRONICS",
        "about": [
            "USB POWERED — Connect the USB side to either laptop or through adapter to any power source.",
            "VOLUME CONTROL — Dedicated volume control knob.",
            "AUX INPUT — Connects to laptop, desktop via 3.5mm jack.",
             "COMPACT DESIGN — Easy to carry and place on desk."
        ],
        "specs": {
            "Brand": "ZEBRONICS",
            "Speaker Maximum Output Power": "5 Watts",
             "Connectivity Technology": "Auxiliary, USB",
            "Audio Output Mode": "Stereo",
             "Mounting Type": "Tabletop"
        },
        "offers": []

    },
    {
        "id": 6,
        "title": "Logitech Brio 100 Full HD 1080P Webcam for Meetings and Streaming, Auto-Light Balance",
        "price": 3095.00,
        "originalPrice": 3995.00,
        "rating": 4.4,
        "reviewCount": 25393,
        "image": "/zebronic.jpg",
        "isPrime": True,
        "category": "electronics",
        "inStock": True,
        "brand": "Logitech",
        "about": [
            "FULL HD 1080P WEBCAM — Look your best in video meetings with Brio 100.",
             "AUTO-LIGHT BALANCE — RightLight 2 technology automatically adjusts up to 50% brightness.",
             "PRIVACY SHUTTER — Integrated privacy shutter slides over the lens.",
             "BUILT-IN MICROPHONE — Omni-directional mic ensures distinct audio."
        ],
         "specs": {
            "Brand": "Logitech",
            "Video Capture Resolution": "1080p",
             "Connectivity Technology": "USB",
             "Has Image Stabilization": "No",
             "Image Capture Speed": "30 fps"
        },
        "offers": [
              {"type": "Bank Offer", "description": "7.5% Instant Discount up to INR 1500 on Yes Bank Credit Card EMI Transactions. Minimum purchase value INR 10000", "link": "1 offer >"}
        ]
    },
    {
        "id": 7,
        "title": "ZEBRONICS 180HB USB HUB, 3 Ports, USB 3.0, Transfer Speeds Upto 5 Gbps, Lightweight",
        "price": 169.00,
        "originalPrice": 449.00,
        "rating": 3.8,
        "reviewCount": 2174,
        "image": "/drive.jpg",
        "isPrime": True,
        "category": "electronics",
        "inStock": True,
        "brand": "ZEBRONICS",
        "about": [
             "3 PORT USB HUB — Convert single USB port to 3 ports.",
             "USB 3.0 — High speed transfer upto 5Gbps.",
             "PLUG AND PLAY — No driver installation required.",
             "COMPACT AND LIGHTWEIGHT — Design easy to carry."
        ],
        "specs": {
            "Brand": "ZEBRONICS",
             "Hardware Interface": "USB 3.0",
             "Number of Ports": "3",
             "Compatible Devices": "Laptops, Desktops",
             "Data Transfer Rate": "5 Gbps"
        },
        "offers": []
    }
]

def get_deals():
    """Generate deals with dynamic end times"""
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
        },
        {
            "id": 2,
            "title": "Lightning Deal",
            "product": {
                "id": 102,
                "title": "Bose QuietComfort Ultra Earbuds",
                "price": 229.00,
                "originalPrice": 299.00,
                "discount": 23,
                "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
                "rating": 4.5,
                "reviewCount": 12345
            },
            "endsAt": (datetime.utcnow() + timedelta(hours=3)).isoformat(),
            "claimed": 67
        },
        {
            "id": 3,
            "title": "Lightning Deal",
            "product": {
                "id": 103,
                "title": "iRobot Roomba i4 EVO Robot Vacuum",
                "price": 249.99,
                "originalPrice": 399.99,
                "discount": 38,
                "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
                "rating": 4.4,
                "reviewCount": 34567
            },
            "endsAt": (datetime.utcnow() + timedelta(hours=5)).isoformat(),
            "claimed": 45
        },
        {
            "id": 4,
            "title": "Lightning Deal",
            "product": {
                "id": 104,
                "title": "Philips Sonicare DiamondClean Smart 9500",
                "price": 179.95,
                "originalPrice": 329.99,
                "discount": 45,
                "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
                "rating": 4.6,
                "reviewCount": 23456
            },
            "endsAt": (datetime.utcnow() + timedelta(hours=6)).isoformat(),
            "claimed": 78
        }
    ]

HERO_SLIDES = [
    {
        "id": 1,
        "image": "/60percent.jpg",
        "title": "Up to 60% off | Clearance Store",
        "link": "/deals",
        "backgroundColor": "#e3e6e6"
    },
    {
        "id": 2,
        "image": "/tshirt.jpg",
        "title": "New Arrivals in Men's T-Shirts",
        "link": "",
        "backgroundColor": "#e3e6e6"
    },
    {
        "id": 3,
        "image": "/saree.jpg",
        "title": "Ethnic Wear & Sarees",
        "link": "",
        "backgroundColor": "#e3e6e6"
    },
    {
        "id": 4,
        "image": "/dumbell.jpg",
        "title": "Fitness & Gym Essentials",
        "link": "/category/sports",
        "backgroundColor": "#e3e6e6"
    }
]

SEARCH_CATEGORIES = [
    "All",
    "Electronics",
    "Computers",
    "Smart Home",
    "Arts & Crafts",
    "Automotive",
    "Baby",
    "Beauty & Personal Care",
    "Books",
    "Fashion",
    "Health & Household",
    "Home & Kitchen",
    "Industrial & Scientific",
    "Kindle Store",
    "Movies & TV",
    "Music",
    "Pet Supplies",
    "Sports & Outdoors",
    "Tools & Home Improvement",
    "Toys & Games"
]

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

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all product categories"""
    return CATEGORIES

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    """Get all products, optionally filtered by category"""
    if category and category != "All":
        return [p for p in PRODUCTS if p["category"].lower() == category.lower()]
    return PRODUCTS

@api_router.get("/products/search", response_model=List[Product])
async def search_products(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query("All", description="Category filter")
):
    """Search products by query and category"""
    results = PRODUCTS.copy()
    
    if category and category != "All":
        cat_lower = category.lower().replace(" ", "-").replace("&", "")
        results = [p for p in results if cat_lower in p["category"].lower()]
    
    if q:
        query_lower = q.lower()
        results = [
            p for p in results 
            if query_lower in p["title"].lower() or 
               query_lower in p["category"].lower()
        ]
    
    return results

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """Get a single product by ID"""
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.get("/deals")
async def get_deals_endpoint():
    """Get current deals with live countdown timers"""
    return get_deals()

@api_router.get("/hero-slides", response_model=List[HeroSlide])
async def get_hero_slides():
    """Get hero carousel slides"""
    return HERO_SLIDES

@api_router.get("/search-categories", response_model=List[str])
async def get_search_categories():
    """Get all search categories"""
    return SEARCH_CATEGORIES

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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
