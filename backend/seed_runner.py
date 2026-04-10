from app.db import engine
from sqlalchemy import text
import os

seed_path = '../database/seed.sql'
with engine.begin() as conn:
    with open(seed_path, 'r') as f:
        statements = f.read().split(';')
        for stmt in statements:
            if stmt.strip():
                conn.execute(text(stmt))
print('SEED EXECUTED SUCCESSFULLY!')
