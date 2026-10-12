from flask import Blueprint, jsonify, request
from app.config.conexion import conectar

servicios_bp = Blueprint("servicios", __name__)

# GET - Listar servicios con JOIN
@servicios_bp.route("/api/servicios", methods=["GET"])
def obtener_servicios():
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        query = """
            SELECT s.id, s.descripcion, s.estado, s.fecha, 
                   c.id AS cliente_id, c.nombre AS cliente_nombre, 
                   t.id AS tecnico_id, t.nombre AS tecnico_nombre
            FROM servicio s
            JOIN cliente c ON s.cliente_id = c.id
            JOIN tecnico t ON s.tecnico_id = t.id
        """
        cursor.execute(query)
        filas = cursor.fetchall()
        
        servicios = []
        for fila in filas:
            servicios.append({
                "id": fila[0],
                "descripcion": fila[1],
                "estado": fila[2],
                "fecha": str(fila[3]) if fila[3] else "",
                "cliente_id": fila[4],
                "cliente_nombre": fila[5],
                "tecnico_id": fila[6],
                "tecnico_nombre": fila[7]
            })
            
        return jsonify({"success": True, "servicios": servicios}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        conexion.close()

# POST - Crear un nuevo servicio
@servicios_bp.route("/api/servicios", methods=["POST"])
def crear_servicio():
    datos = request.get_json(silent=True)
    if not isinstance(datos, dict):
        return jsonify({"success": False, "message": "JSON válido requerido"}), 400
    
    cliente_id = datos.get("cliente_id")
    tecnico_id = datos.get("tecnico_id")
    descripcion = datos.get("descripcion")
    estado = datos.get("estado", "Pendiente")
    fecha = datos.get("fecha")

    if not cliente_id or not tecnico_id or not descripcion:
        return jsonify({"success": False, "message": "Cliente, técnico y descripción son obligatorios"}), 400

    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        query = """
            INSERT INTO servicio (cliente_id, tecnico_id, descripcion, estado, fecha)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (cliente_id, tecnico_id, descripcion.strip(), estado, fecha if fecha else None))
        conexion.commit()
        return jsonify({"success": True, "message": "Servicio registrado con éxito", "id": cursor.lastrowid}), 201
    except Exception as e:
        conexion.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        conexion.close()

# PUT - Actualizar servicio
@servicios_bp.route("/api/servicios/<int:servicio_id>", methods=["PUT"])
def actualizar_servicio(servicio_id):
    datos = request.get_json(silent=True)
    if not isinstance(datos, dict):
        return jsonify({"success": False, "message": "JSON válido requerido"}), 400

    cliente_id = datos.get("cliente_id")
    tecnico_id = datos.get("tecnico_id")
    descripcion = datos.get("descripcion")
    estado = datos.get("estado")
    fecha = datos.get("fecha")

    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        query = """
            UPDATE servicio 
            SET cliente_id = %s, tecnico_id = %s, descripcion = %s, estado = %s, fecha = %s
            WHERE id = %s
        """
        cursor.execute(query, (cliente_id, tecnico_id, descripcion, estado, fecha if fecha else None, servicio_id))
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({"success": False, "message": "Servicio no encontrado"}), 404
        return jsonify({"success": True, "message": "Servicio actualizado con éxito"}), 200
    except Exception as e:
        conexion.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        conexion.close()

# DELETE - Eliminar servicio
@servicios_bp.route("/api/servicios/<int:servicio_id>", methods=["DELETE"])
def eliminar_servicio(servicio_id):
    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Sin conexión a BD"}), 500
    cursor = None
    try:
        cursor = conexion.cursor()
        cursor.execute("DELETE FROM servicio WHERE id = %s", (servicio_id,))
        conexion.commit()
        if cursor.rowcount == 0:
            return jsonify({"success": False, "message": "Servicio no encontrado"}), 404
        return jsonify({"success": True, "message": "Servicio eliminado con éxito"}), 200
    except Exception as e:
        conexion.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        conexion.close()