const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const items = require('./routes/api/items');

const app = express();

//Bodyparser middleware
app.use(bodyParser.json());

//db config
const db = require('./config/keys').mongoURI;

//connect to mongo
mongoose
	.connect(db, {useNewUrlParser: true})
	.then(() => console.log('MongoDB is Connected...'))
	.catch(err => console.log(err));

//use routes
app.use('/api/items', items)

//serve static assets if we are in production

if(process.env.NODE_ENV === 'production') {
	//set static folder
	app.use(express.static('client/build'));
	app.get('*', (reg, res) => {
		res.send(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}	

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`))