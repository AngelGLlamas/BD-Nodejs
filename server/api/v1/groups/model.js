//call to mongoose

const mongoose = require('mongoose');

const { Schema } = mongoose;

//field requirements
const fields = {
  title: {
    type: String,
    required: false,
    trim: true,
    maxlength: 128,
  },
};

const references = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
};

const group = new Schema(Object.assign(fields, references), {
  timestamps: true,
});

module.exports = {
  Model: mongoose.model('group', group),
  fields,
  references,
};
