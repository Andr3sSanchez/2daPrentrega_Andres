import express from 'express';
import ProductManager from '../services/ProductManager.js';
import CartManager from '../services/CartManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Vista de productos con paginación
router.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Convertimos la página actual a número entero
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'asc';
    const query = req.query.query || '';

    const productsData = await productManager.getAllProducts({ page, limit, sort, query });

    res.render('home', {
        products: productsData.payload,
        page: productsData.page, // Usamos `page` de productsData
        totalPages: productsData.totalPages,
        hasNextPage: productsData.hasNextPage,
        hasPrevPage: productsData.hasPrevPage,
        nextPage: productsData.hasNextPage ? `/products?page=${productsData.page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
        prevPage: productsData.hasPrevPage ? `/products?page=${productsData.page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null
    });
});

// Vista de detalles de un producto
router.get('/products/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) {
        return res.status(404).render('error', { message: 'Producto no encontrado' });
    }
    res.render('productDetails', { product });
});

// Vista de carrito específico
router.get('/carts/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
        return res.status(404).render('error', { message: 'Carrito no encontrado' });
    }
    res.render('cart', { cart: cart.payload });
});

export default router;
