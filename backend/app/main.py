from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import trees
from .database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nested Tags API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trees.router)

@app.get("/")
def root():
    return {"message": "Nested Tags API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}