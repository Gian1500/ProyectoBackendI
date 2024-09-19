// src/routes/products.js
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { initSocket } from '../socket.js';


const router = Router();

// __dirname representa el directorio actual de este archivo
const productsFilePath = path.join(path.resolve(), 'src', 'data', 'products.json');

const readProducts = () => {
    if (!fs.existsSync(productsFilePath)) {
        return [];
    }
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Rutas para manejar productos (listado, creación, actualización, eliminación)
router.get('/', (req, res) => {
    const products = readProducts();
    const limit = parseInt(req.query.limit, 10);
    if (limit && limit > 0) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: (products.length + 1).toString(),
        ...req.body,
        status: true
    };
    products.push(newProduct);
    writeProducts(products);
    initSocket().emit('product-updated', products); // Emitir evento de actualización
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    products[index] = { ...products[index], ...req.body, id: products[index].id };
    writeProducts(products);
    res.json(products[index]);
});

router.delete('/:pid', (req, res) => {
    let products = readProducts();
    products = products.filter(p => p.id !== req.params.pid);
    writeProducts(products);
    initSocket().emit('product-updated', products); // Emitir evento de actualización
    res.status(204).end();
});

export default router;
