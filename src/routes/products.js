import { Router } from 'express';
import fs from 'fs';

const router = Router();
const path = './routes/products.json';

const readProducts = () => {
    if (!fs.existsSync(path)) {
        return [];
    }
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
};

const writeProducts = (products) => {
    fs.writeFileSync(path, JSON.stringify(products, null, 2));
};

// Listar todos los productos (con limitación opcional)
router.get('/', (req, res) => {
    const products = readProducts();
    const limit = parseInt(req.query.limit, 10);
    if (limit && limit > 0) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});

// Obtener producto por ID
router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

// Agregar nuevo producto
router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: (products.length + 1).toString(),
        ...req.body,
        status: true
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// Actualizar producto por ID
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

// Eliminar producto por ID
router.delete('/:pid', (req, res) => {
    let products = readProducts();
    products = products.filter(p => p.id !== req.params.pid);
    writeProducts(products);
    res.status(204).end();
});

export default router;
