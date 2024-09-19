import { Router } from 'express';
import { readProducts, writeProducts } from '../utils/ProductManager.js';

const router = Router();

export default function productsRouter(io) {
    router.get('/', (req, res) => {
        try {
            const products = readProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error al leer productos', error });
        }
    });

    router.post('/', (req, res) => {
        try {
            const products = readProducts();
            const newProduct = { 
                id: (products.length + 1).toString(),
                ...req.body 
            };
            products.push(newProduct);
            writeProducts(products);

            io.emit('product-updated', products);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: 'Error al agregar producto', error });
        }
    });

    router.delete('/:id', (req, res) => {
        try {
            let products = readProducts();
            products = products.filter(product => product.id !== req.params.id);
            writeProducts(products);

            io.emit('product-updated', products);
            res.json({ message: 'Producto eliminado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar producto', error });
        }
    });

    return router;
}
