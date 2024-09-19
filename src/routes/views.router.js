import { Router } from 'express';
import { readProducts } from '../utils/ProductManager.js';

const router = Router();

// Ruta para renderizar la página principal con la lista de productos
router.get('/', (req, res) => {
    try {
        const products = readProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
});

// Ruta para renderizar la página de productos en tiempo real
router.get('/realTimeProducts', (req, res) => {
    try {
        const products = readProducts();
        res.render('realtimeProducts', { products });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error });
    }
});

export default router;
