import fs from 'fs';
import path from 'path';

// Ruta al archivo JSON donde se almacenan los carritos
const cartsFilePath = path.join(path.resolve(), 'src', 'data', 'carts.json');

// Función para leer los carritos del archivo
export const readCarts = () => {
    if (!fs.existsSync(cartsFilePath)) {
        return [];
    }
    const data = fs.readFileSync(cartsFilePath, 'utf-8');
    return JSON.parse(data);
};

// Función para escribir la lista de carritos en el archivo
export const writeCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};
