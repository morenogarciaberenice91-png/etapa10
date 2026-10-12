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

    useEffect(() => {
        const cargarDatos = async () => {
            const [s, c, t] = await Promise.all([
                obtenerServicios(), obtenerClientesCatalogo(), obtenerTecnicosCatalogo()
            ]);
            if (s.ok) setServicios(s.datos.servicios || []);
            if (c.ok) setClientes(c.datos.clientes || []);
            if (t.ok) setTecnicos(t.datos.tecnicos || []);
        };
        cargarDatos();
    }, []);

    const limpiar = () => {
        setClienteId(""); setTecnicoId(""); setDescripcion("");
        setEstado("Pendiente"); setFecha(""); setEditandoId(null);
    };

    const guardar = async (e) => {
        e.preventDefault();
        if (!clienteId || !tecnicoId || !descripcion.trim()) {
            setMensaje("Cliente, técnico y descripción son obligatorios");
            return;
        }
        const datos = {
            cliente_id: Number(clienteId),
            tecnico_id: Number(tecnicoId),
            descripcion, estado, fecha
        };
        const r = editandoId
            ? await actualizarServicio(editandoId, datos)
            : await crearServicio(datos);
        
        setMensaje(r.datos.message || "Operación realizada");
        if (r.ok) { 
            limpiar(); 
            // Recargar datos
            const s = await obtenerServicios();
            if (s.ok) setServicios(s.datos.servicios || []);
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
        if (!window.confirm("¿Eliminar este servicio de prueba?")) return;
        const r = await eliminarServicio(id);
        setMensaje(r.datos.message || "Operación realizada");
        if (r.ok) {
            const s = await obtenerServicios();
            if (s.ok) setServicios(s.datos.servicios || []);
        }
    };

    return (
        <div className="dashboard">
            <h1>Servicios Técnicos</h1>
            <form onSubmit={guardar}>
                <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
                    <option value="">Seleccione cliente</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>

                <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)}>
                    <option value="">Seleccione técnico</option>
                    {tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>

                <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" />

                <select value={estado} onChange={e => setEstado(e.target.value)}>
                    <option>Pendiente</option>
                    <option>En proceso</option>
                    <option>Terminado</option>
                    <option>Cancelado</option>
                </select>

                <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />

                <button type="submit">{editandoId ? "Actualizar" : "Registrar"}</button>
                {editandoId && <button type="button" onClick={limpiar}>Cancelar</button>}
            </form>

            {mensaje && <p>{mensaje}</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th><th>Cliente</th><th>Técnico</th>
                        <th>Descripción</th><th>Estado</th><th>Fecha</th><th>Acciones</th>
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
                                <button onClick={() => editar(s)}>Editar</button>
                                <button onClick={() => eliminar(s.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Servicios;