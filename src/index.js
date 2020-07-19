const express = require('express')
const path = require('path')
const exp_hbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')

//Initializations
const app = express();
require('./database');

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
//Global Variables
//Routes
app.use(require('./routes/index'))
app.use(require('./routes/stocks'))
app.use(require('./routes/users'))

//Static files
app.use(express.static(path.join(__dirname, 'public')));
//Server initialization
app.listen(app.get('port'), ()=> {
    console.log("Server listening on port:", app.get('port'));
});