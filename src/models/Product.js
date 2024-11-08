import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: [String], default: [] },
  status: { type: Boolean, default: true },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
