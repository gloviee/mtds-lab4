const express = require('express');
const router = express.Router();
const {
  addItemToUser,
  getAllUsers,
  deleteAllUsers,
  getUserWithItems
} = require('../controllers/UserController');

router.post('/add-item', addItemToUser);
router.get('/', getAllUsers);
router.delete('/', deleteAllUsers);
router.get('/:username', getUserWithItems);

module.exports = router;
