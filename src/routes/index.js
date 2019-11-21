const express = require('express');
const router = express.Router();
const User = require('../models/User');


/*router.get('/', (req,res) => {
    res.render('index');
});
*/
router.get('/', async (req,res)=> {
    const usuarios = await User.find({user:req.user});
    console.log(usuarios);
    res.render('index',{usuarios}); 
})

router.get('/about',(req,res) => {
    res.render('about');
});






module.exports = router;