import {createPool} from'mysql2/promise';


// Se crea una conexion al servidor con sus credenciales
export const poolmysql = createPool({
    database: process.env.database, // Base de datos
    host: process.env.host_db, // Direccion
    port: process.env.port_db, // Puerto
    user: process.env.user_db, // Usuario
    password: process.env.password_db // Contraseña
});