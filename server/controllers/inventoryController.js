const Inventory = require('../models/Inventory');

// GET /api/inventory — the logged-in staff member's own facility stock.
exports.listMine = async (req, res) => {
  try {
    const facilityId = req.user.facilityId;
    if (!facilityId) return res.status(400).json({ message: 'Create your facility first' });
    // Soonest-to-expire first, so the most urgent items are at the top.
    const items = await Inventory.find({ facilityId }).sort({ expiryDate: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/inventory — add a stock item to the staff's facility.
exports.addItem = async (req, res) => {
  try {
    const facilityId = req.user.facilityId;
    if (!facilityId) return res.status(400).json({ message: 'Create your facility first' });

    const { itemType, bloodGroup, component, name, quantity, unit, batchNo, expiryDate } = req.body;

    // Validate on the server too (never trust the client alone).
    if (!itemType || quantity === undefined) {
      return res.status(400).json({ message: 'Item type and quantity are required' });
    }
    if (Number(quantity) <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }
    if (itemType === 'blood' && !bloodGroup) {
      return res.status(400).json({ message: 'Blood group is required for a blood item' });
    }
    if (itemType === 'medicine' && !name) {
      return res.status(400).json({ message: 'Medicine name is required' });
    }

    const item = await Inventory.create({ facilityId, itemType, bloodGroup, component, name, quantity, unit, batchNo, expiryDate });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/inventory/:id — edit an item (only from your own facility).
exports.updateItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (String(item.facilityId) !== String(req.user.facilityId)) {
      return res.status(403).json({ message: 'This item belongs to another facility' });
    }

    const allowed = ['itemType', 'bloodGroup', 'component', 'name', 'quantity', 'unit', 'batchNo', 'expiryDate'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) item[key] = req.body[key];
    });
    if (item.quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/inventory/:id — remove an item (only from your own facility).
exports.deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (String(item.facilityId) !== String(req.user.facilityId)) {
      return res.status(403).json({ message: 'This item belongs to another facility' });
    }
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
