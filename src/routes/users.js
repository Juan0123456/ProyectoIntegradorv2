const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport'); 
const Trabajo = require('../models/Trabajo');

router.get('/users/signin' , (req,res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/trabajos',
    failureRedirect: '/users/signin',
    failureFlash:true
}));
router.get('/users/galeria',  async (req,res) => {
    const trabajos= await Trabajo.find({user: req.user.id });
    console.log(trabajos);
    res.render('users/galeria', {trabajos});

});

router.get('/users/signup',(req,res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const {name, email , password, confirm_password} = req.body;
    const errors = [];

    if(name.length <= 0) {
        errors.push({text:'Por favor ingresa tu nombre'});
    }

    if(password!= confirm_password){
        errors.push({text: 'No coinciden las constraseñas'});
    }
    if( password.length<4 ){
        errors.push({text: 'La contraseña debe ser mayor a 4 caracteres'});   
    }
    if(errors.length>0){
        res.render('users/signup', {errors, name, email , password, confirm_password});
    }
    else{
        const emailUser= await User.findOne({email:email});
        if(emailUser){
            req.flash('error_msg','El correo esta en uso');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Registro exitoso');
        res.redirect('/users/signin');
    }
});


router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;