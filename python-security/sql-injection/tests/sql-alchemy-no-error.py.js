from sqlalchemy import text
  
# write the SQL query inside the text() block
sql = text('SELECT * from BOOKS WHERE BOOKS.book_price > 50')
results = engine.execute(sql)