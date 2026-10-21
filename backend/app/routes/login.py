from flask import Blueprint, request, jsonify
from app.config.conexion import conectar
from werkzeug.security import check_password_hash

login_bp = Blueprint("login", __name__)

@login_bp.route("/api/login", methods=["POST"])
def login():
    try:
        datos = request.get_json(silent=True) or {}
        username = str(datos.get("username", "")).strip()
        password = str(datos.get("password", "")).strip()

        if not username or not password:
            return jsonify({"success": False, "message": "Username y contraseña son requeridos"}), 400

        conexion = conectar()
        if conexion is None:
            return jsonify({"success": False, "message": "Error de conexión a la base de datos"}), 500

        cursor = None
        try:
            cursor = conexion.cursor()
            query = "SELECT id, username, password FROM usuario WHERE username = %s"
            cursor.execute(query, (username,))
            usuario = cursor.fetchone()

            if usuario:
                db_id = usuario['id'] if isinstance(usuario, dict) else usuario[0]
                db_user = usuario['username'] if isinstance(usuario, dict) else usuario[1]
                db_pass = str(usuario['password'] if isinstance(usuario, dict) else usuario[2]).strip()

                # Valida si la contraseña coincide directamente o mediante hash seguro
                if db_pass == password or check_password_hash(db_pass, password):
                    return jsonify({
                        "success": True, 
                        "message": "Inicio de sesión exitoso",
                        "usuario": {"id": db_id, "username": db_user}
                    }), 200

            return jsonify({
                "success": False, 
                "message": "Usuario o contraseña incorrectos"
            }), 401

        finally:
            if cursor:
                cursor.close()
            conexion.close()

    except Exception as e:
        return jsonify({"success": False, "message": f"Error en el servidor: {str(e)}"}), 500