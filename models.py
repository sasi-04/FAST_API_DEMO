#for pydantic models used in main.py for request and response body
from pydantic import BaseModel
class Product(BaseModel) :
    id:int
    name:str
    description:str
    price:float
    quantity:int
   