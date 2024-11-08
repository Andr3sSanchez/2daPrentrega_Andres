import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import __dirname from './utils.js';
import viewRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';

const app = express();
const PORT = process.env.PORT || 9090;

mongoose.connect('mongodb+srv://andressanchez447:jbvXmn9QWK3DDiOS@cluster0.6u1ge.mongodb.net/myStore?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Conexión a MongoDB exitosa");
})
.catch(err => {
  console.error("Error al conectar con MongoDB:", err);
});

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Configuración para recibir JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(__dirname + '/public'));

// Rutas de vistas y APIs
app.use('/', viewRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

// Iniciar servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

const socketServer = new Server(httpServer);
