import fs from 'fs';
import path from 'path';

// Ruta al archivo JSON donde se almacenan los productos
const productsFilePath = path.join(path.resolve(), 'src', 'data', 'products.json');

// Función para leer los productos del archivo
export const readProducts = () => {
    // Verifica si el archivo de productos existe
    if (!fs.existsSync(productsFilePath)) {
        return [];
    }

    const data = fs.readFileSync(productsFilePath, 'utf-8');
    // Parsea el contenido JSON a un objeto JavaScript y lo retorna
    return JSON.parse(data);
};

// Función para escribir la lista de productos en el archivo
export const writeProducts = (products) => {
    const data = JSON.stringify(products, null, 2);
    fs.writeFileSync(productsFilePath, data);
};
