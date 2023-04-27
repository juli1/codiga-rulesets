import mysql.connector

connection = mysql.connector.connect(
  host=host,
  user=user,
  passwd=password,
  database=database,
  charset='utf8mb4',
  use_pure=True,
  connection_timeout=5)