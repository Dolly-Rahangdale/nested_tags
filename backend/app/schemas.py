from pydantic import BaseModel
from typing import List, Union, Optional
from datetime import datetime

class TagNode(BaseModel):
    name: str
    data: Optional[str] = None
    children: Optional[List['TagNode']] = None

TagNode.update_forward_refs()

class TreeRecordCreate(BaseModel):
    name: str
    data: dict

class TreeRecordUpdate(BaseModel):
    name: str
    data: dict

class TreeRecordResponse(BaseModel):
    id: int
    name: str
    data: dict
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True