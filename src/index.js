const express = require ('express');
const path = require('path');
const exphbs=require('express-handlebars');
const methodOverride= require('method-override');
const session =require('express-session');
const uuid= require('uuid');
const multer = require('multer');
const morgan = require('morgan');
const flash = require('connect-flash');
const passport= require('passport');

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


//initializations
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname:'.hbs',
}));

app.set('view engine', '.hbs');

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'));
app.use(session({
    secret: 'proyecto',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/trabajos/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
});
app.use (multer({storage: storage}).single('trabajo'));


//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


//Routes

app.use(require('./routes/index'));
app.use(require('./routes/trabajos'));
app.use(require('./routes/users'));





//Static files
app.use(express.static(path.join(__dirname,'public')));



//Server is listening
app.listen(app.get('port'), () => {
   console.log('Server on port', app.get('port')); 
});
