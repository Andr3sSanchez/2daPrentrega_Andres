import { Router } from 'express';
import ProductManager from '../services/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// Ruta para obtener productos con filtros, paginación y ordenamiento
router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;
  const result = await productManager.getAllProducts({
    limit: parseInt(limit),
    page: parseInt(page),
    query,
    sort,
  });
  res.json(result);
});

// Ruta para obtener un producto por ID
router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta para agregar un producto
router.post('/', async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// Ruta para actualizar un producto
router.put('/:pid', async (req, res) => {
  const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
  const deletedProduct = await productManager.deleteProduct(req.params.pid);
  if (deletedProduct) {
    res.json(deletedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

export default router;
