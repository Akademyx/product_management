const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '/static')));
const mongoose = require('mongoose');
app.use(express.static(__dirname + '/public/dist'));
//This points to our dist folder
//we typically call it public, or at least keept it consistent
mongoose.connect('mongodb://localhost/products');

var ProductSchema = new mongoose.Schema({
    title: { type: String, minlength: [4, 'Title must be of at least 4 characters length'] },
    price: { type: Number, min: [1, 'Price must be at least 1 Dollar minimum'] },
    img: {data:Buffer, contentType: String}
}, { timestamps: true })

var Product = mongoose.model('Product', ProductSchema);

app.get('/products', (req, res) => {
    Product.find({}, (err, tasks) => {
        res.json(tasks)
    })
})

app.post('/products', (req, res) => {
    var product = new Product({title: req.body.title, price: req.body.price, url: req.body.url });
    product.save((err, savedProduct) => {
        if (err) {
            res.json(err)
        } else {
            res.json(savedProduct)
        }
    })
})

app.get('/products/edit/:id', (req, res) => {
    Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err) {
            console.log(err);
        } else {
            res.json(product)
        }
    })
})

// app.put('/products/:id', (req, res) => {
//     Product.findByIdAndUpdate(req.params.id, req.body, (err, confirmation) => {
//         if (err) {
//             console.log(err);
//             res.json()
//         } else {
//             res.json({ success: "Successfully updated" })
//         }
//     })
// })

app.put('/products/:id', (req, res) => {
    Product.findOne({ _id: req.params.id }, (err, product) => {
        console.log("This is currently product", product)
        if (err) {
            res.json(err)
        } else {
            product.title = req.body.title;
            product.price = req.body.price;
            product.url = req.body.url;
            product.save((err) => {
                if (err) {
                    console.log("We hit err ", err)
                    res.json(err);
                } else {
                    console.log("Successfully updated")
                    res.json(product);
                }
            })
        }
    })
})

app.delete('/products/:id', (req, res) => {
    Product.remove({ _id: req.params.id }, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.json({ success: "Deleted a product" })
        }
    })
})

app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/index.html"))
});

app.listen(8000, () => {
    console.log("We're on 8000")
})