const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock')
const { isAuthenticated } = require('../helpers/auth')

function orderDesc(a,b) {
    return b.date - a.date;
}

router.get('/', isAuthenticated, async (req,res) => {
    const stocks = await Stock.find({user: req.user.id}).then(docs => {
        const contexto = {
            stocks: docs.map(doc => {
                return {
                    _id: doc._id,
                    title: doc.title,
                    description: doc.description,
                    amount: doc.amount,
                    price: doc.price,
                    date: doc.date, 
                    user: doc.user
                }
            })
        }
        return contexto;
    })
    stocks.stocks = stocks.stocks.sort(orderDesc);
    res.render('stocks/all-stocks', {stocks: stocks.stocks});
})

router.post('/new-stock', isAuthenticated, async (req,res) => {
    console.log(req.body);
    const {title,description,amount,price} = req.body;
    const errors = [];

    if(!title)
        errors.push({text: "Falta titulo"});
    
    if(!description)
        errors.push({text: "No description"});

    if(!amount)
        errors.push({text: "No hay cantidad"})

    if(!price)
        errors.push({text: "No hay precio"});

    if(errors.length > 0){
        res.render('stocks/new-stock', {
            errors,
            title,
            description,
            amount,
            price
        })
    } else {
        const newStock = new Stock({title,description,amount,price});
        newStock.user = req.user.id;
        await newStock.save();
        req.flash('success_msg', 'Stock agregado correctamente');
        res.redirect("/stocks");
    }
})

router.get('/add', isAuthenticated, (req,res) => {
    res.render('stocks/new-stock');
})

router.get('/:id/edit', isAuthenticated, async(req,res) => {
    const stock = await Stock.findById(req.params.id);
    res.render('stocks/edit-stock', {_id: stock._id});
})

router.put('/:id', isAuthenticated, async(req,res)=>{
    const {title,description,amount,price} = req.body;
    await Stock.findByIdAndUpdate(req.params.id, {title,description,amount,price});
    req.flash('success_msg', 'Stock actualizado correctamente')
    res.redirect('/stocks');
})

router.delete('/:id', isAuthenticated, async(req,res) => {
    await Stock.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Borrado correctamente');
    res.redirect('/stocks')
})


module.exports = router;