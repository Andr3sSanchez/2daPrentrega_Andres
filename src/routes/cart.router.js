import { Router } from 'express';
import CartManager from '../services/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// Crear un carrito
router.post('/', async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

// Obtener un carrito con productos completos (populate)
router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  res.status(cart.status === 'success' ? 200 : 404).json(cart);
});

// Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
  const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  res.status(cart.status === 'success' ? 200 : 404).json(cart);
});

// Actualizar el carrito completo con un arreglo de productos
router.put('/:cid', async (req, res) => {
  const { products } = req.body;
  const result = await cartManager.updateCartProducts(req.params.cid, products);
  res.status(result.status === 'success' ? 200 : 404).json(result);
});

// Actualizar solo la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  const { quantity } = req.body;
  const result = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
  res.status(result.status === 'success' ? 200 : 404).json(result);
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const cart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
  res.status(cart.status === 'success' ? 200 : 404).json(cart);
});

// Vaciar el carrito (eliminar todos los productos)
router.delete('/:cid', async (req, res) => {
  const cart = await cartManager.clearCart(req.params.cid);
  res.status(cart.status === 'success' ? 200 : 404).json(cart);
});

export default router;
