import { Server } from 'socket.io';
import { readProducts, writeProducts } from './utils/productUtils.js';

// Función para inicializar Socket.IO con el servidor
export function initSocket(server) {
    // Crea una instancia de Socket.IO asociada al servidor HTTP
    const io = new Server(server);

    // Maneja la conexión de un cliente al servidor WebSocket
    io.on('connection', (socket) => {
        console.log('Cliente conectado');

        // Cuando un cliente se conecta, envía la lista actual de productos
        socket.emit('product-updated', readProducts());

        // Escucha el evento 'product-added' cuando el cliente agrega un nuevo producto
        socket.on('product-added', (product) => {
            const products = readProducts();  // Lee los productos actuales
            // Crea un nuevo producto con un ID único y estado activo
            const newProduct = {
                id: (products.length + 1).toString(),  // Genera un ID secuencial
                ...product,  
                status: true  
            };
            products.push(newProduct); 
            writeProducts(products);  
            io.emit('product-updated', products);  // Envía la lista actualizada a todos los clientes
        });

        // Escucha el evento 'product-deleted' cuando el cliente elimina un producto
        socket.on('product-deleted', (productId) => {
            let products = readProducts(); 
            // Filtra la lista para eliminar el producto con el ID especificado
            products = products.filter(p => p.id !== productId);
            writeProducts(products); 
            io.emit('product-updated', products);  // Envía la lista actualizada a todos los clientes
        });
    });

    // Retorna la instancia de Socket.IO para su uso en otros módulos si es necesario
    return io;
}
