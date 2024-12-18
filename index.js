const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const routes     = require('./routes');
const mongoose   = require('mongoose');
const rateLimit = require('express-rate-limit');

mongoose.connect('mongodb://localhost:27017/heros', { useNewUrlParser: true , useUnifiedTopology: true });

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100, 
	message: 'Too many requests, please try again later.',
	statusCode: 429,
	headers: true,          
  	keyGenerator: (req) => req.ip, 
  	skip: (req) => req.ip === '127.0.0.1',  
  	skipFailedRequests: true, 
  	skipSuccessfulRequests: false,
	standardHeaders: 'draft-7',
	legacyHeaders: false, 
	
})
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
	extended: true 
}));

app.use(express.static('static'));
app.set('view engine', 'pug');

app.use(routes);

app.all('*', (req, res) => {
    return res.status(404).send({
        message: '404 page not found'
    });
});

app.listen(80, () => console.log('Listening on port 1337'));
