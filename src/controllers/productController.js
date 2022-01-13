const db = require('../database/models');
const { validationResult } = require('express-validator');


let controller = {
    cart: (req, res) => {
        res.render('products/cart');
    },
    detail: (req, res) => {
        db.Product.findByPk(req.params.id, { include: ['image', 'category', 'brand'] })
            .then((product) => {
                res.render('products/detail', { product: product })
            })
            .catch((resultado) => { console.log(resultado) })
    },
    beauty: (req, res) => {
        db.Product.findAll({
            where: { category_id: 1 },
            include: ['image']
        }).then((product) => {
            res.render('products/beauty', { product: product })
        }).catch((resultado) => {
            console.log(resultado)
        })
    },
    healthy: (req, res) => {
        db.Product.findAll({
            where: { category_id: 2 },
            include: ['image']
        }).then((product) => {
            res.render('products/healthy', { product: product })
        }).catch((resultado) => {
            console.log(resultado)
        })
    },
    cleaning: (req, res) => {
        db.Product.findAll({
            where: { category_id: 3 },
            include: ['image']
        }).then((product) => {
            res.render('products/cleaning', { product: product })
        }).catch((resultado) => {
            console.log(resultado)
        })
    },
    crud: async (req, res) => {
        let products = await db.Product.findAll({ include: ['category', 'brand'] });
        res.render('products/crud', { products })
    },

    editItem: (req, res) => {
        var categoryPromise = db.Category.findAll();
        var brandPromise = db.Brand.findAll();
        var productPromise = db.Product.findByPk(req.params.id, { include: ['brand', 'category'] });

        Promise.all([categoryPromise, brandPromise, productPromise])
            .then(([categories, brands, product]) => {
                res.render('products/editItem', { product, categories, brands });
            })
            .catch((resultado) => { console.log(resultado) })
    },
    update: async (req, res) => {

        const resultValidation = validationResult(req);
        if (resultValidation.errors.length > 0) {
            var categoryPromise = db.Category.findAll();
            var brandPromise = db.Brand.findAll();
            var productPromise = db.Product.findByPk(req.params.id, { include: ['brand', 'category'] });
    
            Promise.all([categoryPromise, brandPromise, productPromise])
                .then(([categories, brands, product]) => {
                    res.render('products/editItem', { 
                        product, 
                        categories, 
                        brands,
                        errors: resultValidation.mapped(),
                        oldData: req.body, });
                })
                .catch((resultado) => { console.log(resultado) })

        } else {

            var dbProduct = await db.Product.findByPk(req.params.id);
            var image_id = dbProduct.image_id;
            if (req.file && req.file.filename) {
                var newImage = await db.Image.create({
                    name: req.file.filename
                });
                image_id = newImage.id;
            }
            dbProduct.update({
                name: req.body.name,
                brand_id: req.body.brand_id,
                description: req.body.description,
                image_id: image_id,
                category_id: req.body.category_id,
                stock: req.body.stock,
                price: req.body.price,
            });
            dbProduct.save();
            res.redirect('/products/crud');
        }
    },
    addItem: (req, res) => {
        var categoryPromise = db.Category.findAll();
        var brandPromise = db.Brand.findAll();
        Promise.all([categoryPromise, brandPromise])
            .then(([categories, brands]) => {
                res.render('products/addItem', { categories, brands });
            })
            .catch((resultado) => { console.log(resultado) })
    },
    store: async (req, res) => {

        const resultValidation = validationResult(req);
        if (resultValidation.errors.length > 0) {
            var categoryPromise = db.Category.findAll();
            var brandPromise = db.Brand.findAll();
            Promise.all([categoryPromise, brandPromise])
                .then(([categories, brands]) => {
                    res.render('products/addItem', {
                        errors: resultValidation.mapped(),
                        oldData: req.body,
                        categories,
                        brands
                    });
                })
                .catch((resultado) => { console.log(resultado) })

        } else {
            let image_id = null;
            if (req.file && req.file.filename) {
                var newImage = await db.Image.create({
                    name: req.file.filename
                });
                image_id = newImage.id;
            }
            await db.Product.create({ ...req.body, image_id: image_id });
            res.redirect('/products/crud')
        }
    },

        
    delete: async (req, res) => {
        await db.Product.destroy({ where: { id: req.params.id } })
        res.redirect('/products/crud')
    }
}
module.exports = controller;