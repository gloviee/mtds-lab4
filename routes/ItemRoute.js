const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  deleteAllItems
} = require('../controllers/itemController');

router.post('/', createItem);
router.get('/', getItems);
router.delete('/', deleteAllItems);

module.exports = router;
