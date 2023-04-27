from sqlalchemy import text
  
# write the SQL query inside the text() block
sql = text(f"SELECT * from BOOKS WHERE BOOKS.book_price > {my_price}")
results = engine.execute(sql)