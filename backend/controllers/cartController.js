import userModel from "../models/userModel.js";

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "Missing userId or itemId" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = { ...userData.cartData };
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "Missing userId or itemId" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = { ...userData.cartData };
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] <= 0) {
                delete cartData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.error("Remove From Cart Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get user cart
const getCart = async (req, res) => {
    try {
        console.log("Request body:", req.body); // Debugging aid

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "Missing userId" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.error("Get Cart Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { addToCart, removeFromCart, getCart };
