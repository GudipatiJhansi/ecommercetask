import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to get and populate user's cart
const getPopulatedCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return await cart.populate({
    path: 'items.productId',
    select: 'title price imageUrl stock category',
  });
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Validate that product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    // Check if product is already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      const newQty = cart.items[itemIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          message: `Cannot add more items. Max available stock is ${product.stock}`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      // Product doesn't exist, check stock and push new item
      if (Number(quantity) > product.stock) {
        return res.status(400).json({
          message: `Cannot add items. Max available stock is ${product.stock}`,
        });
      }
      cart.items.push({ productId, quantity: Number(quantity) });
    }

    await cart.save();

    const populatedCart = await getPopulatedCart(req.user._id);
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quantity of product in cart
// @route   PUT /api/cart/update
// @access  Private
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    if (Number(quantity) < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Validate product stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        message: `Cannot request ${quantity} units. Max available stock is ${product.stock}`,
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item index
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Number(quantity);
      await cart.save();
      const populatedCart = await getPopulatedCart(req.user._id);
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item by filtering
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    const populatedCart = await getPopulatedCart(req.user._id);
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
