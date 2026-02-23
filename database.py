#for database connection and session and database models
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
db_url="postgresql://postgres:sasi@localhost:5432/mydatabase"
engine=create_engine(db_url)

session=sessionmaker(autoflush=False,bind=engine,autocommit=False)