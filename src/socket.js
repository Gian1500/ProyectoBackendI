import { Server } from 'socket.io';
import { readProducts, writeProducts } from './utils/ProductManager.js'; // Ajusta la ruta según tu estructura

export function initSocket(server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Cliente conectado');

        // Enviar productos al cliente cuando se conecta
        socket.emit('product-updated', readProducts());

        // Escuchar el evento de añadir producto
        socket.on('product-added', (product) => {
            try {
                const products = readProducts();
                const newProduct = {
                    id: (products.length + 1).toString(),
                    ...product,
                    status: true
                };
                products.push(newProduct);
                writeProducts(products);
                io.emit('product-updated', products); // Emitir la lista de productos actualizada
            } catch (error) {
                console.error('Error al añadir producto:', error);
            }
        });

        // Escuchar el evento de eliminar producto
        socket.on('product-deleted', (productId) => {
            try {
                let products = readProducts();
                products = products.filter(p => p.id !== productId);
                writeProducts(products);
                io.emit('product-updated', products); // Emitir la lista de productos actualizada
            } catch (error) {
                console.error('Error al eliminar producto:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });

    return io;
}
