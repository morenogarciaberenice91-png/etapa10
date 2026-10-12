from app import create_app
from flask_cors import CORS
from app.routes.clientes import clientes_bp
from app.routes.tecnicos import tecnicos_bp
from app.routes.servicios import servicios_bp

app = create_app()

# Habilitar CORS para permitir peticiones desde el frontend de React (Vite)
CORS(app)

# Registrar los blueprints antes de iniciar el servidor
app.register_blueprint(clientes_bp)
app.register_blueprint(tecnicos_bp)
app.register_blueprint(servicios_bp)

if __name__ == "__main__":
    app.run(debug=True)