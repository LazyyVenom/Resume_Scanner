# filepath: c:\Users\Anubhav Choubey\Documents\College_Work\Resume_Scanner\backend\app\main.py

from fastapi import FastAPI
from .routes import get_routes

app = FastAPI()

app.include_router(get_routes())