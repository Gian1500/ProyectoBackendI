import { Router } from 'express';
import fs from 'fs';
import path from 'path';  // Importamos 'path' para manejar rutas de archivos de manera segura

const router = Router();

const cartsFilePath = path.join(path.resolve(), 'src', 'data', 'carts.json');

// Función para leer los carritos del archivo
const readCarts = () => {
    if (!fs.existsSync(cartsFilePath)) {
        return [];
    }
    // Lee el contenido del archivo como una cadena de texto
    const data = fs.readFileSync(cartsFilePath, 'utf-8');
    // Parsea el contenido JSON a un objeto JavaScript y lo retorna
    return JSON.parse(data);
};

// Función para escribir la lista de carritos en el archivo
const writeCarts = (carts) => {
    const data = JSON.stringify(carts, null, 2);
    // Escribe la cadena JSON en el archivo, reemplazando el contenido existente
    fs.writeFileSync(cartsFilePath, data);
};

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
    // Lee la lista de carritos existentes
    const carts = readCarts();
    // Crea un nuevo carrito con un ID único y una lista vacía de productos
    const newCart = {
        id: (carts.length + 1).toString(),
        products: []
    };
    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

// Ruta para listar los productos de un carrito específico por su ID
router.get('/:cid', (req, res) => {
    // Lee la lista de carritos existentes
    const carts = readCarts();
    // Busca el carrito con el ID proporcionado en los parámetros de la solicitud
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
});

// Ruta para agregar un producto a un carrito específico
router.post('/:cid/product/:pid', (req, res) => {
    // Lee la lista de carritos existentes
    const carts = readCarts();
    // Busca el carrito con el ID proporcionado en los parámetros de la solicitud
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Busca el índice del producto en la lista de productos del carrito
    const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
    // Si el producto ya está en el carrito, incrementa la cantidad
    if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        // Si el producto no está en el carrito, añádelo con una cantidad inicial de 1
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }
    // Guarda la lista actualizada de carritos en el archivo
    writeCarts(carts);
    // Responde con el carrito actualizado
    res.json(cart);
});

export default router;
