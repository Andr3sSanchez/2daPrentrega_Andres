import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import viewRouter from './routes/views.router.js';

const app = express();
const PORT = process.env.PORT || 9090;

// Preparar la configuración del servidor para recibir objetos JSON
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

// Almacenar los productos en una lista
let products = [];

// Manejar la conexión de los clientes al WebSocket
socketServer.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Enviar la lista inicial de productos a todos los clientes conectados
    socket.emit('updateProducts', products); // Esto envía a cada cliente los productos cuando se conectan

    // Escuchar el evento para agregar productos
    socket.on('addProduct', (newProduct) => {
        // Validación en el servidor
        if (newProduct.price < 0 || newProduct.quantity <= 0) {
            console.log('Producto inválido:', newProduct);
            return;
        }
    
        products.push(newProduct);
        socketServer.emit('updateProducts', products); // Emitir productos actualizados a todos los clientes
    });
    

    // Escuchar el evento para eliminar productos
    socket.on('deleteProduct', (productId) => {
        products = products.filter(p => p.id !== productId); // Filtrar los productos eliminados
        socketServer.emit('updateProducts', products); // Enviar productos actualizados a todos los clientes
    });
});
