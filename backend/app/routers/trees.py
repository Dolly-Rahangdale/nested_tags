from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, database

router = APIRouter(prefix="/api/trees", tags=["trees"])

@router.get("/", response_model=List[schemas.TreeRecordResponse])
def get_all_trees(db: Session = Depends(database.get_db)):
    return crud.get_all_trees(db)

@router.get("/{tree_id}", response_model=schemas.TreeRecordResponse)
def get_tree(tree_id: int, db: Session = Depends(database.get_db)):
    db_tree = crud.get_tree(db, tree_id)
    if db_tree is None:
        raise HTTPException(status_code=404, detail="Tree not found")
    return db_tree

@router.post("/", response_model=schemas.TreeRecordResponse)
def create_tree(tree: schemas.TreeRecordCreate, db: Session = Depends(database.get_db)):
    return crud.create_tree(db, tree)

@router.put("/{tree_id}", response_model=schemas.TreeRecordResponse)
def update_tree(tree_id: int, tree: schemas.TreeRecordUpdate, db: Session = Depends(database.get_db)):
    db_tree = crud.update_tree(db, tree_id, tree)
    if db_tree is None:
        raise HTTPException(status_code=404, detail="Tree not found")
    return db_tree

@router.delete("/{tree_id}")
def delete_tree(tree_id: int, db: Session = Depends(database.get_db)):
    db_tree = crud.delete_tree(db, tree_id)
    if db_tree is None:
        raise HTTPException(status_code=404, detail="Tree not found")
    return {"message": "Tree deleted successfully"}