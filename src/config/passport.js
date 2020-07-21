const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User')

passport.use(new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    if (!user){
        console.log("El usuario no existe");
        //El primero es para devolver un error, si es null funco todo bien
        //Si devuelvo false significa que no hay ningún usuario
        //Luego envio el mensaje de vuelta
        return done(null, false, { message: 'User not found'});
    } else {
        const match = await user.matchPassword(password);
        if (match) {
            //Caso correcto, error null
            //Devuelvo el usuario.
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password'})
        }
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err,user) => {
        done(err, user);
    });
});