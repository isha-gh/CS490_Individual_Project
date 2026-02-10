import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlnjit490project1!",
        database="sakila"
    )