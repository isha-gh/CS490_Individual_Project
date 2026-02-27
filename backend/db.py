import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Ang3lf1sh4l1fe",
        database="sakila"
    )