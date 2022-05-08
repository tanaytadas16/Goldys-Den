const express = require('express');
const router = express.Router();
const booksJSON = require('../data/booksJSON');
router.get('/', async (req, res) => {
    // if (req.argument.length > 0) {
    //     throw [400, 'No arguments needed'];
    // }
    const Booksdata = await booksJSON.DataObjectCreation();
    res.json(Booksdata);
    // res.json([{ name: 'Tanay' }, { name: 'Sushant' }, { name: 'Harshal' }]);
});
router.get('/:genres', async (req, res) => {});
module.exports = router;
