const Item = require('../models/Item');

exports.createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllItems = async (req, res) => {
  try {
    await Item.deleteMany();
    res.json({ message: 'All items deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
