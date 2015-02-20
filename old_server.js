// load the epxress pacakge and create our app
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    path = require('path');

// connect to mongodb
mongoose.connect('mongodb://localhost/db_name');
// send our index.html file to the user for the home page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// create routes for the admin section

// get an instance of the router
var adminRouter = express.Router();

// route middleware that will happen on EVERY request
adminRouter.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next();
});

// admin main page. the dashboard (http://localhost:1337/admin)
adminRouter.get('/', function(req, res) {
    res.send('I am the dashboard!');
});

// user page (http://localhost:1337/admin/users)
adminRouter.get('/users', function(req, res) {
    res.send('I show all the users!');
});

// posts page (http://localhost:1337/admin/posts)
adminRouter.get('/posts', function(req, res) {
    res.send('I show all the posts!');
});


// apply the routes to our application
app.use('/admin', adminRouter);

// using app.route() lets us define multiple actions on a single login route
app.route('/login')
    // show the form (GET http://localhost:1337/login)
    .get(function(req, res) {
        res.send('this is the login form');
    })
    .post(function(req, res) {
        console.log('processing');
        res.send('processing the login form!');
    });

// start the server
app.listen(1337);
console.log('1337 is the magic port!');