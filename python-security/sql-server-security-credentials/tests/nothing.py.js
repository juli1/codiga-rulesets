import mysql.connector

connection = mysql.connector.another_function(
  host=host,
  user=user,
  passwd=f"password",
  database=database,
  charset='utf8mb4',
  use_pure=True,
  connection_timeout=5)