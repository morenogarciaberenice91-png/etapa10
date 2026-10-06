from app import create_app
from app.routes.clientes import clientes_bp
from app.routes.tecnicos import tecnicos_bp

app = create_app()

# Registrar los blueprints antes de iniciar el servidor
app.register_blueprint(clientes_bp)
app.register_blueprint(tecnicos_bp)

if __name__ == "__main__":
    app.run(debug=True)
    