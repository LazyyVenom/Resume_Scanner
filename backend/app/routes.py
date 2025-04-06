from fastapi import APIRouter
from .models import Item
from .schemas import ItemSchema

router = APIRouter()

@router.post("/items/", response_model=ItemSchema)
async def create_item(item: ItemSchema):
    return item

@router.get("/items/{item_id}", response_model=ItemSchema)
async def read_item(item_id: int):
    return Item(id=item_id, name="Sample Item", description="This is a sample item.")

def get_routes():
    return router