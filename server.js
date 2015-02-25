// BASE SETUP
// ===========================

// CALL THE PACKAGES
var express     = require('express'); // call express
var app         = express(); // define our app using express;
var bodyParser  = require('body-parser'); // get body-parser
var morgan      = require('morgan');
var mongoose    = require('mongoose'); // fr working w/ our database
var port        = process.env.PORT || 1337; //set the port for our app
var User        = require('./app/models/user');

// APP CONFIGURATION
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

// connect to our database
mongoose.connect('mongodb://localhost:27017/myDatabase');

// log all requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API
// ================================

// basic route for the home page
app.get('/', function(req, res){
    res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// middleware to use for all request
apiRouter.use(function(req, res, next){
    // do logging
    console.log('Somebody just came to our app!');

    next();
});

apiRouter.route('/users')
    // create a user (accessed at POST http://localhost:1337/api/users)
    .post(function(req, res){
        // create a new instance of the User model
        var user = new User();

        // set the user and check for errors
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        // save the user and check for errors
        user.save(function(err){
            if (err){
                // duplicate entry
                if (err.code == 11000){
                    return res.json({ success: false, message: 'A use with that username already exists. '});
                } else {
                    return res.send(err);
                }
            }
            res.json({ message: 'User created!' });
        });
    })
    .get(function(req, res){
        User.find(function(err, users){
            if (err) res.send(err);

            // return the users
            res.json(users);
        });
    });
apiRouter.route('/users/:user_id')
    // get the user with that id
    // (accessed at GET http://localhost:1337/api/usrs/:usr_id)
    .get(function(req, res){
        User.findById(req.params.user_id, function(err, user){
            if (err) res.send(err);

            // return that user
            res.json(user);
        });
    })

    // update the user with this id
    // (accessed at PUT http://localhost:1337/api/users/:user_id)
    .put(function(req, res){
        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user){
            if (err) res.send(err);

            // update the users info only if its new
            if (req.body.name) user.name = req.body.name;
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.passowrd = req.body.password;

            // save the user
            user.save(function(err){
                if (err) res.send(err);

                // return a message
                res.json({ message: 'User updated!' });
            });
        });
    })
    .delete(function(req, res){
        User.remove({
            _id: req.params.user_id
        }, function(err, user){
            if (err0 return res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
// test route to make sure everything is working
// accessed at GET http://localhost:1337/api
apiRouter.get('/', function(req, res){
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER
// ==================================
app.listen(port);
console.log('Magic happens on port ' + port);
