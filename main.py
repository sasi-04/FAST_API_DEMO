from fastapi import FastAPI,Depends
from models import Product
from database import session, engine
import database_models
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

database_models.Base.metadata.create_all(bind=engine)

@app.get("/")
def greet():
    return "welcome to my world"
products=[Product(id=1,name="Moblie",description="This is a mobile",price=1000,quantity=5),
          Product(id=2,name="Laptop",description="This is laptop",price=10000,quantity=10),
          Product(id=3,name="Tablet",description="This is tablet",price=5000,quantity=15),
            Product(id=4,name="Headphones",description="This is headphones",price=2000,quantity=20)
]
# for open  and close database connection
def get_db():
    db=session()
    try:
        yield db
    finally:
        db.close()


#database inject
def init_db():
    db= session()
    count=db.query(database_models.Product).count
    if count==0:
        for product in products:
            db.add(database_models.Product(**product.model_dump()))
        db.commit()

init_db()

    
#for get all products
@app.get("/products")
def get_products(db:Session =Depends(get_db)):
    db_products=db.query(database_models.Product).all()
    return db_products

#for get product by id
@app.get("/products/{id}")
def get_product_by_id(id: int,db:Session=Depends(get_db)):
    db_product =db.query(database_models.Product).filter(database_models.Product.id==id).first()
    if db_product:
        return db_product
    return "Product not found"


#for add new product
@app.post("/products")
def add_products(p:Product,db:Session=Depends(get_db)):
     db.add(database_models.Product(**p.model_dump()))
     db.commit()
     return p

#for update product from database
@app.put("/products/{id}")
def update_products(id: int, product: Product,db:Session=Depends(get_db)):
    db_product =db.query(database_models.Product).filter(database_models.Product.id==id).first()
    if db_product:
        db_product.name=product.name
        db_product.description=product.description
        db_product.price=product.price
        db_product.quantity=product.quantity
        db.commit()
        return "product updated successfully"   
    return "product id not found"




@app.delete("/products/{id}")
def del_products(id:int,db:Session=Depends(get_db)):
    db_product =db.query(database_models.Product).filter(database_models.Product.id==id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return "product deleted successfully"
    return "product id not found"