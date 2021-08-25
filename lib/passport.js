const db = require('../lib/db');

module.exports = (app) => {
    const passport = require('passport');
    const GoogleStrategy = require('passport-google-oauth2').Strategy;
    const googleCredentials = require('../config/google.json');

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        done(null, db.get('users').find({
            id: id
        }).value());
    });

    passport.use(new GoogleStrategy({
        clientID: googleCredentials.web.client_id,
        clientSecret: googleCredentials.web.client_secret,
        callbackURL: googleCredentials.web.redirect_uris[0],
        passReqToCallback: true
    }, (request, accessToken, refreshToken, profile, done) => {
        const user = {
            id: profile.id,
            displayName: profile.displayName,
            profilePicture: profile.picture
        };
        if (!db.get('users').find(user).value()) {
            db.get('users').push(user).write();
        }
        return done(null, user);
    }));

    app.get('/auth/google', passport.authenticate('google', {
        scope: ['email', 'profile']
    }));

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
    }));

    return passport;
}