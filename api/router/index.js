const router = require('express').Router();
const passport = require('passport');

/**use next cuando haya middleware propio */

//bienvenida
router.get('/', (req, res) => {
    res.render('index');
});

//registro
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true //para pasar la propiedad de req que viene del cliente
    
}));

//ingreso

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true //para pasar la propiedad de req que viene del cliente
    
}));

//cerrar sesion
router.get('/logout', (req, res)=> {
    req.logout();
    res.redirect('/');
})

//vista perfil
router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile');
   
})

//vista carrito
router.get('/orders', isAuthenticated, (req, res) => {
    res.render('orders');
   
})

//vista catalogo
router.get('/store', isAuthenticated, (req, res) => {
    res.render('store');
   
})

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/')
}


module.exports = router;