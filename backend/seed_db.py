import json
from database import init_db, get_db_connection

# Mock data extracted from original server.py
CATEGORIES = [
    {"id": 1, "name": "Electronics", "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop", "link": "/category/electronics"},
    {"id": 2, "name": "Fashion", "image": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop", "link": "/category/fashion"},
    {"id": 3, "name": "Home & Kitchen", "image": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop", "link": "/category/home-kitchen"},
    {"id": 4, "name": "Books", "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop", "link": "/category/books"},
    {"id": 5, "name": "Sports & Outdoors", "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop", "link": "/category/sports"},
    {"id": 6, "name": "Beauty & Personal Care", "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop", "link": "/category/beauty"},
    {"id": 7, "name": "Toys & Games", "image": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=300&fit=crop", "link": "/category/toys"},
    {"id": 8, "name": "Grocery", "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop", "link": "/category/grocery"}
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

HERO_SLIDES = [
    {"id": 1, "image": "/60percent.jpg", "title": "Up to 60% off | Clearance Store", "link": "/deals", "backgroundColor": "#e3e6e6"},
    {"id": 2, "image": "/tshirt.jpg", "title": "New Arrivals in Men's T-Shirts", "link": "", "backgroundColor": "#e3e6e6"},
    {"id": 3, "image": "/saree.jpg", "title": "Ethnic Wear & Sarees", "link": "", "backgroundColor": "#e3e6e6"},
    {"id": 4, "image": "/dumbell.jpg", "title": "Fitness & Gym Essentials", "link": "/category/sports", "backgroundColor": "#e3e6e6"}
]

def seed():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Clear existing data
    cursor.execute("DELETE FROM order_items")
    cursor.execute("DELETE FROM orders")
    cursor.execute("DELETE FROM users")
    cursor.execute("DELETE FROM categories")
    cursor.execute("DELETE FROM products")
    cursor.execute("DELETE FROM hero_slides")
    
    # Seed categories
    for cat in CATEGORIES:
        cursor.execute(
            "INSERT INTO categories (id, name, image, link) VALUES (?, ?, ?, ?)",
            (cat['id'], cat['name'], cat['image'], cat['link'])
        )
        
    # Seed products
    for p in PRODUCTS:
        cursor.execute(
            """INSERT INTO products 
               (id, title, price, originalPrice, rating, reviewCount, image, isPrime, category, inStock, brand, about, specs, offers) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (p['id'], p['title'], p['price'], p['originalPrice'], p['rating'], p['reviewCount'], 
             p['image'], p['isPrime'], p['category'], p['inStock'], p.get('brand'), 
             json.dumps(p.get('about', [])), json.dumps(p.get('specs', {})), json.dumps(p.get('offers', [])))
        )
        
    # Seed hero slides
    for slide in HERO_SLIDES:
        cursor.execute(
            "INSERT INTO hero_slides (id, image, title, link, backgroundColor) VALUES (?, ?, ?, ?, ?)",
            (slide['id'], slide['image'], slide['title'], slide['link'], slide['backgroundColor'])
        )
    
    # Seed demo user
    import hashlib
    demo_user = {
        'id': 'user-demo-001',
        'email': 'demo@amazon.com',
        'password_hash': hashlib.sha256('password123'.encode()).hexdigest(),
        'first_name': 'John',
        'last_name': 'Doe',
        'phone': '+91-9876543210',
        'is_prime': True
    }
    cursor.execute(
        """INSERT INTO users (id, email, password_hash, first_name, last_name, phone, is_prime)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (demo_user['id'], demo_user['email'], demo_user['password_hash'], 
         demo_user['first_name'], demo_user['last_name'], demo_user['phone'], demo_user['is_prime'])
    )
    
    # Seed mock orders
    from datetime import datetime, timedelta
    
    orders = [
        {
            'id': 'order-001',
            'order_number': 'ORD-2024-001',
            'user_id': 'user-demo-001',
            'status': 'delivered',
            'created_at': (datetime.now() - timedelta(days=30)).isoformat(),
            'delivered_at': (datetime.now() - timedelta(days=25)).isoformat(),
            'items': [
                {'product_id': 1, 'quantity': 1},  # iPhone 17 Pro
            ]
        },
        {
            'id': 'order-002',
            'order_number': 'ORD-2024-002',
            'user_id': 'user-demo-001',
            'status': 'delivered',
            'created_at': (datetime.now() - timedelta(days=60)).isoformat(),
            'delivered_at': (datetime.now() - timedelta(days=55)).isoformat(),
            'items': [
                {'product_id': 3, 'quantity': 1},  # AirPods
                {'product_id': 2, 'quantity': 1},  # Charger
            ]
        },
        {
            'id': 'order-003',
            'order_number': 'ORD-2024-003',
            'user_id': 'user-demo-001',
            'status': 'shipped',
            'created_at': (datetime.now() - timedelta(days=5)).isoformat(),
            'delivered_at': None,
            'items': [
                {'product_id': 5, 'quantity': 2},  # Speakers
                {'product_id': 4, 'quantity': 1},  # USB Cable
            ]
        },
        {
            'id': 'order-004',
            'order_number': 'ORD-2024-004',
            'user_id': 'user-demo-001',
            'status': 'processing',
            'created_at': (datetime.now() - timedelta(days=1)).isoformat(),
            'delivered_at': None,
            'items': [
                {'product_id': 6, 'quantity': 1},  # Webcam
            ]
        }
    ]
    
    for order_data in orders:
        # Calculate order totals
        subtotal = 0
        order_items = []
        
        for item in order_data['items']:
            product = next(p for p in PRODUCTS if p['id'] == item['product_id'])
            unit_price = product['price']
            quantity = item['quantity']
            total_price = unit_price * quantity
            subtotal += total_price
            
            # Create product snapshot
            product_snapshot = {
                'id': product['id'],
                'title': product['title'],
                'image': product['image'],
                'brand': product.get('brand', ''),
                'price': product['price']
            }
            
            order_items.append({
                'product_id': item['product_id'],
                'quantity': quantity,
                'unit_price': unit_price,
                'total_price': total_price,
                'product_snapshot': product_snapshot
            })
        
        tax = round(subtotal * 0.18, 2)  # 18% GST
        shipping_fee = 0.00 if demo_user['is_prime'] else 40.00
        total = subtotal + tax + shipping_fee
        
        shipping_address = {
            'full_name': f"{demo_user['first_name']} {demo_user['last_name']}",
            'address': '123 MG Road, Bangalore',
            'city': 'Bangalore',
            'state': 'Karnataka',
            'pincode': '560001',
            'phone': demo_user['phone']
        }
        
        # Insert order
        cursor.execute(
            """INSERT INTO orders 
               (id, order_number, user_id, status, subtotal, tax, shipping_fee, discount, total, 
                shipping_address, created_at, delivered_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (order_data['id'], order_data['order_number'], order_data['user_id'], 
             order_data['status'], subtotal, tax, shipping_fee, 0.00, total,
             json.dumps(shipping_address), order_data['created_at'], order_data['delivered_at'])
        )
        
        # Insert order items
        for idx, item in enumerate(order_items):
            cursor.execute(
                """INSERT INTO order_items 
                   (id, order_id, product_id, product_snapshot, quantity, unit_price, total_price)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (f"{order_data['id']}-item-{idx+1}", order_data['id'], item['product_id'],
                 json.dumps(item['product_snapshot']), item['quantity'], 
                 item['unit_price'], item['total_price'])
            )
        
    conn.commit()
    conn.close()
    print("Database seeded successfully!")
    print(f"Demo user: {demo_user['email']} / password123")
    print(f"Created {len(orders)} orders for demo user")


if __name__ == "__main__":
    seed()
