const router = require('express').Router();
const path = require('path');

router.get('/login', (req, res) => {
    res.sendFile('login.html', {
        root: path.join(__dirname, '../public')
    });
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;