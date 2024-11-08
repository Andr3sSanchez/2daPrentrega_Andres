import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

function formatResponse(payload, page = 1, totalPages = 1) {
  return {
    status: payload ? 'success' : 'error',
    payload,
    totalPages,
    page,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
    prevLink: page > 1 ? `/api/carts?page=${page - 1}` : null,
    nextLink: page < totalPages ? `/api/carts?page=${page + 1}` : null
  };
}

export default class CartManager {
  // Crear un nuevo carrito
  async createCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart;
  }

  // Obtener carrito por ID con populate para productos
  async getCartById(id) {
    try {
      const cart = await Cart.findById(id).populate('products.productId').lean(); // Añadido .lean()
      return formatResponse(cart);
    } catch (error) {
      console.error(error);
      return formatResponse(null);
    }
  }

  // Agregar producto a un carrito
  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return formatResponse(null);

      const product = await Product.findById(productId);
      if (!product) throw new Error('Producto no encontrado');

      const productInCart = cart.products.find(
        p => p.productId.toString() === productId.toString()
      );

      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }

      await cart.save();
      return formatResponse(cart);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      return formatResponse(null);
    }
  }

  // Actualizar el carrito completo con un arreglo de productos
  async updateCartProducts(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return formatResponse(null);

      for (const { productId } of products) {
        const product = await Product.findById(productId);
        if (!product) throw new Error(`Producto con ID ${productId} no encontrado`);
      }

      cart.products = products;
      await cart.save();
      return formatResponse(cart);
    } catch (error) {
      console.error("Error actualizando el carrito:", error);
      return formatResponse(null);
    }
  }

  // Actualizar solo la cantidad de un producto en el carrito
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return formatResponse(null);

      const productInCart = cart.products.find(p => p.productId.toString() === productId.toString());
      if (!productInCart) return formatResponse(null);

      productInCart.quantity = quantity;
      await cart.save();
      return formatResponse(cart);
    } catch (error) {
      console.error("Error actualizando cantidad del producto:", error);
      return formatResponse(null);
    }
  }

  // Eliminar producto de un carrito
  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return formatResponse(null);

      cart.products = cart.products.filter(p => p.productId.toString() !== productId.toString());
      await cart.save();
      return formatResponse(cart);
    } catch (error) {
      console.error("Error eliminando producto del carrito:", error);
      return formatResponse(null);
    }
  }

  // Vaciar el carrito (eliminar todos los productos)
  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return formatResponse(null);

      cart.products = [];
      await cart.save();
      return formatResponse(cart);
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      return formatResponse(null);
    }
  }
}
