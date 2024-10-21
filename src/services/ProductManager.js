class ProductManager {
    constructor() {
        this.products = [];
    }

    // Obtener todos los productos
    getProducts() {
        return this.products;
    }

    // Agregar un producto
    addProduct(product) {
        this.products.push(product);
    }

    // Eliminar un producto por ID
    deleteProduct(productId) {
        this.products = this.products.filter(p => p.id !== productId);
    }
}

export default ProductManager;
