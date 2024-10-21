import express from 'express';

const router = express.Router();

// Ruta para la vista principal (home)
router.get('/', (req, res) => {
    res.render('home', { products: [] }); // Renderiza la vista de productos vacía inicialmente
});

// Ruta para la vista en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts'); // Renderiza la vista en tiempo real
});

export default router;
