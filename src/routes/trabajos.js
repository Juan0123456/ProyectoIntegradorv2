const express = require('express');

const router = express.Router();
const Trabajo = require('../models/Trabajo');
const fs = require('fs-extra');
const { isAuthenticated} = require ('../helpers/auth');
const cloudinary= require('cloudinary');

cloudinary.config({                 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/trabajos/add', isAuthenticated ,(req,res) => {
    res.render('trabajos/newTrabajo');
});

router.post('/trabajos/newTrabajo', isAuthenticated , async (req,res) => {
    const {titulo,descripcion} = req.body;
    

        
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            const newTrabajo = new Trabajo({
                titulo,
                descripcion,
                imageURL: result.url,
                public_id: result.public_id,
                user: req.user.id 
            });
            await newTrabajo.save();
             fs.unlink(req.file.path);
            req.flash('success_msg' , 'Trabajo agregado exitosamente!');
            res.redirect('/trabajos');
       
    
  
});

router.get('/trabajos', isAuthenticated , async (req,res) => {
    const trabajos= await Trabajo.find({user: req.user.id });
    console.log(trabajos);
    res.render('trabajos/carpeta', {trabajos});

});




router.get('/trabajos/edit/:id' , isAuthenticated , async (req, res) => {
    const trabajo = await Trabajo.findById(req.params.id);
    res.render('trabajos/editTrabajo', {trabajo});
});

router.put('/trabajos/editTrabajo/:id', isAuthenticated , async(req, res) => {
    const {titulo,descripcion} = req.body;
    await Trabajo.findByIdAndUpdate(req.params.id , {titulo,descripcion});
    req.flash('success_msg','Trabajo actualizado satisfactoriamente');
    res.redirect('/trabajos');
});

/*router.get('/trabajos/:id/delete', async (req, res) => {
    const {id} = req.params;
    const trabajo = await Trabajo.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public/trabajos' + trabajo.path));
    res.redirect('/trabajos');  
});
*/


router.delete('/trabajos/delete/:trabajo_id' , isAuthenticated ,async (req, res) => {
    const {trabajo_id} = req.params;
   const trabajo = await Trabajo.findByIdAndDelete(trabajo_id);
   const result = await cloudinary.v2.uploader.destroy(trabajo.public_id);
   console.log(result);
   req.flash('success_msg','Trabajo eliminado satisfactoriamente');
    res.redirect('/trabajos');
});



module.exports = router; 