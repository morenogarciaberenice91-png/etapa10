from flask import Blueprint, jsonify, request
from app.config.conexion import conectar

tecnicos_bp = Blueprint("tecnicos", __name__)

# GET - listar técnicos
@tecnicos_bp.route("/api/tecnicos", methods=["GET"])
def obtener_tecnicos():
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute("SELECT id, nombre, especialidad FROM tecnico")
        filas = cursor.fetchall()
        
        tecnicos = []
        for fila in filas:
            tecnicos.append({
                "id": fila[0],
                "nombre": fila[1],
                "especialidad": fila[2]
            })
            
        return jsonify({"success": True, "tecnicos": tecnicos}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: 
            cursor.close()
        conexion.close()

# GET - Catálogo de técnicos (para el select de servicios)
@tecnicos_bp.route("/api/tecnicos/catalogo", methods=["GET"])
def catalogo_tecnicos():
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute("SELECT id, nombre FROM tecnico ORDER BY nombre")
        filas = cursor.fetchall()
        
        tecnicos = []
        for fila in filas:
            tecnicos.append({
                "id": fila[0],
                "nombre": fila[1]
            })
            
        return jsonify({"success": True, "tecnicos": tecnicos}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: 
            cursor.close()
        conexion.close()

# POST - crear técnico
@tecnicos_bp.route("/api/tecnicos", methods=["POST"])
def crear_tecnico():
    datos = request.get_json(silent=True)
    if not isinstance(datos, dict):
        return jsonify({"success": False, "message": "JSON válido requerido"}), 400
    
    nombre = datos.get("nombre")
    especialidad = datos.get("especialidad")
    
    if not nombre or not especialidad:
        return jsonify({"success": False, "message": "Nombre y especialidad son obligatorios"}), 400
        
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute(
            "INSERT INTO tecnico (nombre, especialidad) VALUES (%s, %s)",
            (nombre.strip(), especialidad.strip())
        )
        conexion.commit()
        return jsonify({"success": True, "message": "Técnico creado", "id": cursor.lastrowid}), 201
    except Exception as e:
        conexion.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: 
            cursor.close()
        conexion.close()

# PUT - actualizar técnico
@tecnicos_bp.route("/api/tecnicos/<int:tecnico_id>", methods=["PUT"])
def actualizar_tecnico(tecnico_id):
    datos = request.get_json(silent=True)
    if not isinstance(datos, dict):
        return jsonify({"success": False, "message": "JSON válido requerido"}), 400
        
    nombre = datos.get("nombre")
    especialidad = datos.get("especialidad")
    
    if not nombre or not especialidad:
        return jsonify({"success": False, "message": "Campos obligatorios"}), 400
        
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute(
            "UPDATE tecnico SET nombre=%s, especialidad=%s WHERE id=%s",
            (nombre.strip(), especialidad.strip(), tecnico_id)
        )
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({"success": False, "message": "Técnico no encontrado"}), 404
        return jsonify({"success": True, "message": "Técnico actualizado"}), 200
    except Exception as e:
        conexion.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: 
            cursor.close()
        conexion.close()

# DELETE - eliminar técnico
@tecnicos_bp.route("/api/tecnicos/<int:tecnico_id>", methods=["DELETE"])
def eliminar_tecnico(tecnico_id):
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute("DELETE FROM tecnico WHERE id=%s", (tecnico_id,))
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({"success": False, "message": "Técnico no encontrado"}), 404
        return jsonify({"success": True, "message": "Técnico eliminado"}), 200
    except Exception as e:
        conexion.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: 
            cursor.close()
        conexion.close()