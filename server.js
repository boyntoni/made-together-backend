const express        = require('express');
const app            = express();
const mongoose 		= require('mongoose');
const bodyParser 	= require('body-parser');
const helmet = require('helmet');

const mongoUri = 'mongodb://boyntoni:buchillon1*@ds015962.mlab.com:15962/made-together-staging';
const env = process.env.NODE_ENV || 'dev';
const registration = require('./routes/registration')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use('/api', [registration]);

const server = app.listen(process.env.PORT || 8081, () => console.log(`Server listening at port ${server.address().port}.`));

mongoose.connect(mongoUri, (err) => { if (err) { throw err; } });
const db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error:'));
db.once('open', () => console.log('DB is now connected.'));
