import { useEffect, useState } from "react";
import {
    obtenerServicios, obtenerClientesCatalogo, obtenerTecnicosCatalogo,
    crearServicio, actualizarServicio, eliminarServicio
} from "../services/api";

function Servicios() {
    const [servicios, setServicios] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [tecnicos, setTecnicos] = useState([]);
    
    const [clienteId, setClienteId] = useState("");
    const [tecnicoId, setTecnicoId] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("Pendiente");
    const [fecha, setFecha] = useState("");
    const [editandoId, setEditandoId] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    // Cargar datos al montar el componente sin afectar estados síncronos del effect
    useEffect(() => {
        async function cargarDatos() {
            try {
                const [s, c, t] = await Promise.all([
                    obtenerServicios(), obtenerClientesCatalogo(), obtenerTecnicosCatalogo()
                ]);
                if (s.ok) setServicios(s.datos.servicios || []);
                if (c.ok) setClientes(c.datos.clientes || []);
                if (t.ok) setTecnicos(t.datos.tecnicos || []);
            } catch (error) {
                console.error(error);
                setMensaje("❌ Error al conectar con el servidor.");
            }
        }
        cargarDatos();
    }, []);

    const limpiar = () => {
        setClienteId(""); setTecnicoId(""); setDescripcion("");
        setEstado("Pendiente"); setFecha(""); setEditandoId(null);
    };

    const guardar = async (e) => {
        e.preventDefault();
        setMensaje("");

        if (!clienteId || !tecnicoId || !descripcion.trim() || !estado || !fecha) {
            setMensaje("⚠️ Completa todos los campos obligatorios antes de guardar.");
            return;
        }

        const datos = {
            cliente_id: Number(clienteId),
            tecnico_id: Number(tecnicoId),
            descripcion, estado, fecha
        };

        setCargando(true);
        try {
            const r = editandoId
                ? await actualizarServicio(editandoId, datos)
                : await crearServicio(datos);
            
            if (r.ok) {
                setMensaje(r.datos.message || "✅ Operación realizada con éxito.");
                limpiar(); 
                
                // Recargar datos actualizados
                const s = await obtenerServicios();
                if (s.ok) setServicios(s.datos.servicios || []);
            } else {
                setMensaje(`❌ Error: ${r.datos.error || "No fue posible guardar el servicio."}`);
            }
        } catch (error) {
            console.error(error);
            setMensaje("❌ Ocurrió un error inesperado al procesar la solicitud.");
        } finally {
            setCargando(false);
        }
    };

    const editar = (s) => {
        setEditandoId(s.id);
        setClienteId(s.cliente_id);
        setTecnicoId(s.tecnico_id);
        setDescripcion(s.descripcion);
        setEstado(s.estado || "Pendiente");
        setFecha(s.fecha || "");
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Deseas eliminar este registro de prueba?")) return;
        try {
            const r = await eliminarServicio(id);
            if (r.ok) {
                setMensaje(r.datos.message || "🗑️ Servicio eliminado correctamente.");
                const s = await obtenerServicios();
                if (s.ok) setServicios(s.datos.servicios || []);
            } else {
                setMensaje(`❌ Error al eliminar: ${r.datos.error || ""}`);
            }
        } catch (error) {
            console.error(error);
            setMensaje("❌ Error al conectar con el servidor.");
        }
    };

    return (
        <div className="dashboard">
            <h1>Servicios Técnicos</h1>
            <p>Registra, edita y administra los servicios asignados a cada cliente y técnico.</p>

            {mensaje && <div className="tarjeta-mensaje">{mensaje}</div>}

            <form onSubmit={guardar} className="tarjeta">
                <div>
                    <label>Cliente:</label>
                    <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
                        <option value="">Seleccione cliente</option>
                        {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                </div>

                <div>
                    <label>Técnico:</label>
                    <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)}>
                        <option value="">Seleccione técnico</option>
                        {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                    </select>
                </div>

                <div>
                    <label>Descripción:</label>
                    <input 
                        value={descripcion} 
                        onChange={e => setDescripcion(e.target.value)} 
                        placeholder="Descripción detallada del servicio" 
                    />
                </div>

                <div>
                    <label>Estado:</label>
                    <select value={estado} onChange={e => setEstado(e.target.value)}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Terminado">Terminado</option>
                        <option value="Cancelado">Cancelado</option>
                    </select>
                </div>

                <div>
                    <label>Fecha:</label>
                    <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
                </div>

                <button type="submit" disabled={cargando} className="boton">
                    {cargando ? "Guardando..." : (editandoId ? "Actualizar Servicio" : "Registrar Servicio")}
                </button>
                {editandoId && <button type="button" onClick={limpiar} className="boton-cancelar" style={{marginLeft: "10px"}}>Cancelar</button>}
            </form>

            <div className="tarjeta">
                <h3>Lista de Servicios Registrados</h3>
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Técnico</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicios.map(s => (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.cliente_nombre}</td>
                                <td>{s.tecnico_nombre}</td>
                                <td>{s.descripcion}</td>
                                <td>{s.estado}</td>
                                <td>{s.fecha}</td>
                                <td>
                                    <button onClick={() => editar(s)} className="boton" style={{marginRight: "5px"}}>Editar</button>
                                    <button onClick={() => eliminar(s.id)} className="boton-eliminar">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Servicios;