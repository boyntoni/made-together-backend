const express        = require('express');
const app            = express();
const mongoose 		= require('mongoose');
const bodyParser 	= require('body-parser');
const helmet = require('helmet');
const http = require('http');
const path = require('path');
const methods = require('methods');
const session = require('express-session');
const passport = require('passport');
const errorhandler = require('errorhandler');
const methodOverride = require('method-override');

const isProduction = process.env.NODE_ENV === 'production'

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));
app.use(helmet());

if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://boyntoni:buchillon1*@ds015962.mlab.com:15962/made-together-staging');
  mongoose.set('debug', true);
}

require('./models/Group');
require('./models/Account');
require('./config/passport');

app.use(require('./routes'));

if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

if (isProduction) {
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'errors': {
      message: err.message,
      error: {}
    }});
  });
}

const server = app.listen(process.env.PORT || 3000, () => console.log(`Server listening at port ${server.address().port}.`));
