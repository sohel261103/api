const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/productModel');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// MongoDB Connection
mongoose.connect('mongodb+srv://pradeep:6O6tJYeS0vKUeyvg@cluster0.qlorrai.mongodb.net/Node-API?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log(error);
});

// Define route handler for root URL
app.get('/', (req, res) => {
    res.redirect('/products');
});

// Routes

// Index route - display all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('index', { products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// New route - display form for adding new product
app.get('/products/new', (req, res) => {
    res.render('new');
});

// Create route - add new product to database
app.post('/products', async (req, res) => {
    try {
        await Product.create(req.body);
        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Edit route - display form for editing product
app.get('/products/:id/edit', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('edit', { product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update route - update product in database
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndUpdate(id, req.body);
        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete route - remove product from database
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
