import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Mysqlpasswordnjit1!",
        database="sakila"
    )