from sqlalchemy.orm import Session
from . import models, schemas
datetime = __import__('datetime').datetime

def get_all_trees(db: Session):
    return db.query(models.TreeRecord).order_by(models.TreeRecord.created_at.desc()).all()

def get_tree(db: Session, tree_id: int):
    return db.query(models.TreeRecord).filter(models.TreeRecord.id == tree_id).first()

def create_tree(db: Session, tree: schemas.TreeRecordCreate):
    db_tree = models.TreeRecord(name=tree.name, data=tree.data)
    db.add(db_tree)
    db.commit()
    db.refresh(db_tree)
    return db_tree

def update_tree(db: Session, tree_id: int, tree: schemas.TreeRecordUpdate):
    db_tree = get_tree(db, tree_id)
    if db_tree:
        db_tree.name = tree.name
        db_tree.data = tree.data
        db_tree.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_tree)
    return db_tree

def delete_tree(db: Session, tree_id: int):
    db_tree = get_tree(db, tree_id)
    if db_tree:
        db.delete(db_tree)
        db.commit()
    return db_tree