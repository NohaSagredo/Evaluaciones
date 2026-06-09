// Importa el framework Express para facilitar la creación de servidores y rutas HTTP
const express = require("express");
// Importa el paquete CORS para permitir que clientes en otros dominios o puertos accedan a este servidor
const cors = require("cors");
// Importa Mongoose, un ODM que facilita la interacción con bases de datos MongoDB
const mongoose = require("mongoose");
// Importa Body-Parser para analizar los datos JSON incluidos en los cuerpos de las solicitudes entrantes
const bodyParser = require("body-parser");
    
// Crea la instancia principal de la aplicación Express
const app = express();
// Define el puerto de red en el que escuchará el servidor
const port = 3000;

// Habilita el middleware CORS para evitar restricciones de seguridad al consumir la API desde el frontend
app.use(cors());
// Habilita el middleware de Body-Parser para procesar las peticiones con datos en formato JSON
app.use(bodyParser.json());

// Realiza la conexión a la base de datos local de MongoDB llamada "bebeiro"
// useNewUrlParser y useUnifiedTopology se usan para usar los motores de conexión modernos de MongoDB
mongoose.connect("mongodb://localhost:27017/BD-No-Estructurados")
.then(() => {
    console.log("Conexión exitosa a la base de datos");
}).catch((error) => {
    console.log("Error al conectar a la base de datos", error);
});

// Obtiene el objeto de conexión de Mongoose para monitorear el estado de la base de datos
const db = mongoose.connection;

// Si ocurre un error al intentar conectarse, se registra y muestra en la consola
db.on("error", console.error.bind(console, "Error de conexión a la base de datos:"));
// Una vez que la conexión se abre exitosamente por primera vez, se muestra un mensaje confirmándolo
db.once("open", () => {
    console.log("Conexión exitosa a la base de datos");
});

// Hace que la aplicación comience a escuchar en el puerto definido y notifica cuando esté listo
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});