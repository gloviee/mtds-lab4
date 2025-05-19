const User = require('../models/User');
const Item = require('../models/Item');

exports.addItemToUser = async (req, res) => {
  try {
    const { username, itemName } = req.body;
    if (!username || !itemName) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ username });
    const item = await Item.findOne({ name: itemName });

    if (!user || !item) return res.status(404).json({ error: 'User or Item not found' });

    user.items = user.items || [];
    user.items.push(item._id);
    await user.save();

    res.json({ message: 'Item added to user', item: itemName });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany();
    res.json({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserWithItems = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate('items');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
      items: user.items
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};