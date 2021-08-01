const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


passport.serializeUser((user, done) => {
    done(null, user.id);  //almacenamos en el browser
  });
  
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);  //buscamos desde la db
    done(null, user);
  });


//passport.use('nombre_estrategia', new Estrategia ( {objeto}, ()=> {} ) )
passport.use('local-signup', new LocalStrategy({
    usernameField:'email',                       //from form
    passwordField:'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    
    const user = await User.findOne({email: email});
    if(user){
      return done(null, false, req.flash('signupMessage', 'Email existente'))
    }
    else{
     
      const newUser = new User();
      newUser.email = email; 
      newUser.password = newUser.encryptPassword(password);
      console.log(newUser);
      await newUser.save();
      return done(null, newUser);
    }
    
    
   
}));          //req otros parametros que pueden venir desde el form -- done es una function


passport.use('local-signin', new LocalStrategy({
  usernameField:'email',                       //from form
  passwordField:'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  
  const user = await User.findOne({email: email});
  if(!user){
    return done(null, false, req.flash('signinMessage', 'No existe Email'));
  }
  if(!user.comparePassword(password)){
    return done(null, false, req.flash('signinMessage', 'Contraseña incorrecta'));
  }

  console.log(user);
  return done(null, user);
  
}));   