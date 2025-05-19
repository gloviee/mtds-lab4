const express = require('express');
const router = express.Router();
const {
  addItemToUser,
  getAllUsers,
  deleteAllUsers,
  getUserWithItems,
  clearUserItems
} = require('../controllers/userController');

router.post('/add-item', addItemToUser);
router.get('/', getAllUsers);
router.delete('/', deleteAllUsers);
router.get('/:username', getUserWithItems);
router.delete('/:username/items', clearUserItems);

module.exports = router;
