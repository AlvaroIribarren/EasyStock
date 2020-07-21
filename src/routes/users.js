const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/', (req,res) => {
    res.send('Index');
})

router.get('/signin', (req,res) => {
    res.render('users/signin');
})

router.post('/authenticate', passport.authenticate('local', {
    successRedirect : '/stocks',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/signup', (req,res) => {
    res.render('users/signup');
})

router.post('/', async(req,res) => {
    const {name,email,password,confirm_password} = req.body;
    const errors = [];
    if (password !== confirm_password){
        errors.push({text: 'Las contraseñas no son iguales'});
        console.log('No son iguales');
    }

    if (password.length < 4)
        errors.push({text: 'Contraseña muy corta, al menos 4 caracteres'});

    if (errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser){
            req.flash('error_msg', 'El email ya se encuentra en uso');
            res.redirect('/users/signup');
        } else {   
            const newUser = await new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Registro exitoso!');
            res.redirect('/users/signin');
        }
    }
})

router.get('/logout', (req,res) => {
    req.logout();   //metodo desde passport
    res.redirect('/');      //al inicio
})

module.exports = router;