const express = require('express')
const path = require('path')
const exp_hbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport')

//Initializations
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exp_hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'alvaro',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    //Handlebars limitations
    user_copy = {};
    if(req.user){
        user_copy.name = req.user.name;
        user_copy.email = req.user.email;
    } else{
        user_copy = null;
    }
    res.locals.user = user_copy || null; //si esta autenticado vale user, sino vale null
    next();
})
//Routes
app.use(require('./routes/index'))
app.use('/stocks', require('./routes/stocks'))
app.use('/users', require('./routes/users'))

//Static files
app.use(express.static(path.join(__dirname, 'public')));
//Server initialization
app.listen(app.get('port'), ()=> {
    console.log("Server listening on port:", app.get('port'));
});