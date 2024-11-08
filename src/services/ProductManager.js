import mongoose from 'mongoose';

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnails: [String],
    status: { type: Boolean, default: true }
});

// Crear el modelo de productos
const Product = mongoose.model('Product', productSchema);

export default class ProductManager {
    // Obtener todos los productos con limitación, paginación, ordenamiento y filtro
    async getAllProducts({ limit = 10, page = 1, sort = 'asc', query = '' }) {
        const sortOrder = sort === 'asc' ? 1 : -1;
        const filters = query ? { category: query } : {};  // Filtro de categoría
        
        const products = await Product.find(filters)
            .sort({ price: sortOrder })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();  // Añadido .lean() para compatibilidad con Handlebars

        const totalProducts = await Product.countDocuments(filters);
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            status: 'success',
            payload: products,
            totalPages,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/api/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null
        };
    }

    // Obtener un producto por su ID
    async getProductById(id) {
        return await Product.findById(id).lean(); // Añadido .lean()
    }

    // Crear un nuevo producto
    async addProduct(productData) {
        const newProduct = new Product(productData);
        await newProduct.save();
        return newProduct;
    }

    // Actualizar un producto
    async updateProduct(id, updatedFields) {
        return await Product.findByIdAndUpdate(id, updatedFields, { new: true }).lean(); // Añadido .lean()
    }

    // Eliminar un producto
    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}
