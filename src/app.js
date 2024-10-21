// app.js
import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import viewRouter from './routes/views.router.js';
import ProductManager from './services/ProductManager.js';

const app = express();
const PORT = process.env.PORT || 9090;

// Instanciamos el ProductManager
const productManager = new ProductManager();

// Configuración del servidor para aceptar objetos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Configuración para servir archivos estáticos
app.use(express.static(__dirname + '/public'));

// Rutas del router de vistas
app.use('/', viewRouter);

// Iniciar el servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

// Configuración del servidor de WebSockets
const socketServer = new Server(httpServer);

// Manejar la conexión de los clientes al WebSocket
socketServer.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Enviar la lista de productos a los clientes al conectarse
    socket.emit('updateProducts', productManager.getProducts());

    // Escuchar el evento para agregar productos
    socket.on('addProduct', (newProduct) => {
        productManager.addProduct(newProduct);
        socketServer.emit('updateProducts', productManager.getProducts());
    });

    // Escuchar el evento para eliminar productos
    socket.on('deleteProduct', (productId) => {
        productManager.deleteProduct(productId);
        socketServer.emit('updateProducts', productManager.getProducts());
    });
});
