const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');

//Item model
const Item = require('../../models/Item');

//@route GET api/items
//@description Get All items
//@access Public

router.get('/', (req, res) => {
    Item.find()
        .sort({ date: -1 })
        .then(items => res.json(items));
});

//@route POST api/items
//@description create a item
//@access Private

router.post('/', auth, (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });
    //save this name to the db
    newItem.save().then(item => res.json(item));
});

//@route DELETE api/items/:id
//@description delete an id
//@access Private

router.delete('/:id', auth, (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({ success: true })))
    	.catch(err => res.status(404).json({ success: false }));
});


module.exports = router;