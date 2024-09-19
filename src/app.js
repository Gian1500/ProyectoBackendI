// Importacion de los módulos necesarios: express para crear el servidor, handlebars para el motor de plantillas,
// path para manejar rutas, socket.io para WebSockets y http para crear el servidor HTTP.
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const __dirname = path.resolve();
const server = http.createServer(app);
const io = new Server(server);

let products = [
    {
        id: "1",
        title: "Zapatillas PUMA",
        description: "para running",
        code: "123",
        price: 20000,
        status: true,
        stock: 30,
        category: "Ropa",
        thumbnails: []
    }
];

// Configuración de los Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    extname: '.handlebars'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'src/public')));

// Ruta principal para renderizar la vista de los productos
app.get('/', (req, res) => {
    res.render('home', { products });
});

// Ruta para renderiazar los productos en tiempo real
app.get('/realTimeProducts', (req, res) => {
    res.render('realtimeProducts');
});

// Configuración de Socket.IO para el manejo de productos en tiempo real
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Emite la lista de productos actual cuando un cliente se conecta
    socket.emit('product-updated', products);

     // Escucha el evento 'product-added' que se emite cuando se añade un nuevo producto desde el cliente.
    socket.on('product-added', (newProduct) => {
          // Crea un nuevo objeto de producto a partir de los datos enviados por el cliente.
        const product = {
            id: (products.length + 1).toString(),
            title: newProduct.title,
            description: newProduct.description || "",
            code: newProduct.code || "",
            price: newProduct.price,
            status: true,
            stock: newProduct.stock || 0,
            category: newProduct.category || "Sin categoría",
            thumbnails: []
        };
        products.push(product);

        // Emite la lista actualizada de productos a todos los clientes conectados
        io.emit('product-updated', products);
    });
    // Maneja la desconexión de un cliente.
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Inicia el servidor en el puerto 8080
server.listen(8080, () => {
    console.log('Server ON en puerto 8080');
});
