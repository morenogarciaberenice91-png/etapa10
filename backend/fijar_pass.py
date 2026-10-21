from werkzeug.security import generate_password_hash
from app.config.conexion import conectar

conexion = conectar()
cursor = conexion.cursor()

# Generamos un hash seguro para la contraseña "12345"
nuevo_hash = generate_password_hash("12345")

# Actualizamos la contraseña del usuario admin y alumno a "12345"
cursor.execute("UPDATE usuario SET password = %s WHERE username IN ('admin', 'alumno')", (nuevo_hash,))
conexion.commit()

cursor.close()
conexion.close()
print("¡Contraseñas actualizadas a '12345' con éxito!")