const express = require('express');
const app = express();
const session = require('express-session');
const fileStore = require('session-file-store')(session);

app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    store: new fileStore()
}));

const passport = require('./lib/passport')(app);
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/auth', authRouter);

const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});