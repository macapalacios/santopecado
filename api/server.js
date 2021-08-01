const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

// Cargamos la configuración de ambiente. Se puede obtener mediante process.env
require('dotenv').config({path: path.resolve(__dirname,'.env')});

//keys
const KEY_SECRET = process.env.KEY_SECRET;


// initializations
const app = express();
require('./database');
require('./passport/local-auth');

//middlewares -- funciones que se deben procesar antes de la peticion a las rutas
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); //save data in req.body
app.use(session({
    secret: `${KEY_SECRET}`,  
    resave: false,
    saveUninitialized: false
})      // recibe un setting of object 
    
);
app.use(flash()); // va antes de la validacion con passport  y despues de las session porque hace uso de las sesiones
                  //flash lo que va hacer sera poblar el req , por lo tanto ahora en req esta ahora la propiedad de flash
app.use(passport.initialize()); // antes de iniciaizar hay que configurar la session 
app.use(passport.session());  // se debe de declarar la session (use express-session)

//personalized middlelwere 
app.use((req, res, next)=>{
   app.locals.signupMessage = req.flash('signupMessage');
   app.locals.signinMessage = req.flash('signinMessage');   //almaceno el mensaje en toda la app
   app.locals.user = req.user;
   next(); //ejecuto el callback para que siga con la app y no quede tildado
})

//router
const router = require('./router/index')
app.use('/', router);
app.use('/static', express.static(path.join(__dirname, '../client/styles')));


//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../client/views'))
app.engine('ejs', engine);
app.set('view engine', 'ejs');
//app.use('../client/styles', express.static('styles'));

//starting the server
app.listen(app.get('port'), () => {
    console.log('Server on Port', app.get('port'))
});