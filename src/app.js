import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js'; 
import viewsRouter from './routes/views.router.js';
import { readProducts, writeProducts } from './utils/ProductManager.js'; 

const app = express();
const __dirname = path.resolve(); // Resolve el directorio actual
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    extname: '.handlebars'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter);

// Configuración de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    // Emitir productos actuales al conectarse un cliente
    socket.emit('product-updated', readProducts());

    // Escuchar el evento de añadir producto desde el cliente
    socket.on('product-added', (product) => {
        const products = readProducts();
        const newProduct = {
            id: (products.length + 1).toString(),
            ...product,
            status: true
        };
        products.push(newProduct);
        writeProducts(products); // Guardar los cambios aquí
        io.emit('product-updated', products);
    });

    // Escuchar el evento de eliminar producto desde el cliente
    socket.on('product-deleted', (productId) => {
        let products = readProducts();
        products = products.filter(p => p.id !== productId);
        writeProducts(products); // Guardar los cambios aquí
        io.emit('product-updated', products);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
server.listen(8080, () => {
    console.log('Server ON en puerto 8080');
});
