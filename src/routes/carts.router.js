import { Router } from 'express';
import { readCarts, writeCarts } from '../utils/CartManager.js'; // Asegúrate de tener un CartManager similar al ProductManager

const router = Router();

// Crear nuevo carrito
router.post('/', (req, res) => {
    try {
        const carts = readCarts();
        const newCart = {
            id: (carts.length + 1).toString(),
            products: []
        };
        carts.push(newCart);
        writeCarts(carts);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear carrito', error });
    }
});

// Listar productos del carrito por ID
router.get('/:cid', (req, res) => {
    try {
        const carts = readCarts();
        const cart = carts.find(c => c.id === req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener carrito', error });
    }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    try {
        const carts = readCarts();
        const cart = carts.find(c => c.id === req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }
        writeCarts(carts);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto al carrito', error });
    }
});

export default router;
