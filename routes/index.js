const router = require('express').Router();

router.get('/', (req, res) => {
    if (req.user) {
        var html = `
            <a href="/auth/logout">Logout</a>
            <h1>Welcome, ${req.user.displayName}!</h1>
            <img src="${req.user.profilePicture}" width="100">`;
        res.send(html);
    } else {
        var html = `
            <a href="/auth/login">Login</a>
            <h1>Who is this?</h1>`;
        res.send(html);
    }
});

module.exports = router;