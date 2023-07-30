const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Diproses',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdraw', withdrawSchema);
