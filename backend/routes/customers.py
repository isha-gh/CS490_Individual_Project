from flask import Blueprint, request, jsonify
from db import get_db

customers_bp = Blueprint('customers', __name__, url_prefix='/api/customers')

@customers_bp.route("/search")
def search_customers():
    query = request.args.get("query", "")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT customer_id, first_name, last_name, email
        FROM customer
        WHERE first_name LIKE %s
           OR last_name LIKE %s
        LIMIT 10
    """, (f"%{query}%", f"%{query}%"))

    customers = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(customers)
