from flask import Blueprint, request, jsonify
from db import get_db

customers_bp = Blueprint('customers', __name__, url_prefix='/api/customers')

def fetch_customers_logic(query_param, page, limit):
    offset = (page - 1) * limit
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    search_id = query_param if query_param.isdigit() else -1
    
    sql = """
        SELECT customer_id, first_name, last_name, email, active
        FROM customer
        WHERE (first_name LIKE %s OR last_name LIKE %s OR customer_id = %s)
        ORDER BY customer_id DESC
        LIMIT %s OFFSET %s
    """
    cursor.execute(sql, (f"%{query_param}%", f"%{query_param}%", search_id, limit, offset))
    customers = cursor.fetchall()
    cursor.close()
    return customers

@customers_bp.route("/", methods=["GET"])
def get_customers():
    query = request.args.get("query", "")
    page = int(request.args.get("page", 1))
    return jsonify(fetch_customers_logic(query, page, 10))

@customers_bp.route("/search", methods=["GET"])
def search_customers():
    query = request.args.get("query", "")
    return jsonify(fetch_customers_logic(query, 1, 10))

@customers_bp.route("/", methods=["POST"])
def add_customer():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    
    sql = """
        INSERT INTO customer (store_id, first_name, last_name, email, address_id, create_date, active)
        VALUES (%s, %s, %s, %s, %s, NOW(), 1)
    """
    try:
        cursor.execute(sql, (1, data['first_name'], data['last_name'], data['email'], 1))
        db.commit()
        return jsonify({"message": "Success", "id": cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()

@customers_bp.route("/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):
    db = get_db()
    cursor = db.cursor()
    try:
        sql = "DELETE FROM customer WHERE customer_id = %s"
        cursor.execute(sql, (customer_id,))
        db.commit()
        return jsonify({"message": "Customer deleted"}), 200
    except Exception as e:
        return jsonify({"error": "Could not delete customer. They likely have rental history."}), 400
    finally:
        cursor.close()