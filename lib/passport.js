const express = require('express');
const db = require('../lib/db');

module.exports = (app) => {
    const passport = require('passport');

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

    const GoogleStrategy = require('passport-google-oauth2').Strategy;
    const googleCredentials = require('../config/google.json');

    passport.use(new GoogleStrategy({
        clientID: googleCredentials.web.client_id,
        clientSecret: googleCredentials.web.client_secret,
        callbackURL: googleCredentials.web.redirect_uris[0],
        passReqToCallback: true
    }, (request, accessToken, refreshToken, profile, done) => {
        const user = {
            token: accessToken,
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

    const FacebookStrategy = require('passport-facebook').Strategy;
    const facebookCredentials = require('../config/facebook.json');
    const request = require('request');

    passport.use(new FacebookStrategy(facebookCredentials, (accessToken, refreshToken, profile, done) => {
        const user = {
            token: accessToken,
            id: profile.id,
            displayName: profile.displayName,
        };
        request.get(`https://graph.facebook.com/${user.id}/picture?type=normal&access_token=${user.token}&redirect=false`,
            (err, res, body) => {
                if (err) {
                    console.error(err);
                } else {
                    user.profilePicture = JSON.parse(body).data.url;
                }
                if (!db.get('users').find(user).value()) {
                    db.get('users').push(user).write();
                }
                return done(null, user);
            });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
    }));

    return passport;
}