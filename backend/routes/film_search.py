from flask import Blueprint, request, jsonify

#import from db.py
from db import get_db

#backend route for films
film_search_bp = Blueprint('film_search', __name__, url_prefix='/api/films')


#code for searching films based on title, actor name, or category

@film_search_bp.route('/search', methods=['GET']) #GET method for searching films
def search_films():
    query = request.args.get('query', '') #read search input from the URL
    conn = get_db() #connect to SQL
    cursor = conn.cursor(dictionary=True) #run the SQL queries, results in dictionary format

    sql = """ 
        SELECT DISTINCT f.film_id, f.title, f.length,f.release_year, f.rating, c.name AS category
        FROM film f
        -- connect all the tables to film table
        JOIN film_actor fa ON f.film_id = fa.film_id
        JOIN actor a ON fa.actor_id = a.actor_id
        JOIN film_category fc ON f.film_id = fc.film_id
        JOIN category c ON fc.category_id = c.category_id
        WHERE f.title LIKE %s 
        OR a.first_name LIKE %s 
        OR a.last_name LIKE %s 
        OR c.name LIKE %s
        """
    
    #query format
    like_query = f"%{query}%" #format the search input for SQL query
    params = (like_query, like_query, like_query, like_query) #parameters for the SQL query; placeholders for film, actor first/last name, category
    cursor.execute(sql, params) #execute the SQL query
    results = cursor.fetchall() #get all the results
    
    cursor.close() #close the cursor
    conn.close() #close the connection

    return jsonify(results) #return the results in JSON format


# @film_search_bp.route('/<int:film_id>', methods=['GET'])
# def get_film_details(film_id):
#     conn = get_db()
#     cursor = conn.cursor(dictionary=True)

#     sql = """
#         SELECT f.film_id, f.title, f.description, f.length,
#                f.release_year, f.rating, c.name AS category
#         FROM film f
#         JOIN film_category fc ON f.film_id = fc.film_id
#         JOIN category c ON fc.category_id = c.category_id
#         WHERE f.film_id = %s
#     """

#     cursor.execute(sql, (film_id,))
#     film = cursor.fetchone()

#     cursor.close()
#     conn.close()

#     if film:
#         return jsonify(film)
#     else:
#         return jsonify({"error": "Film not found"}), 404
