const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { getters: true }
  }
);

// Getter method to format the timestamp
reactionSchema.path('createdAt').get(function(value) {
  // Format the timestamp here as needed
  return value.toLocaleString(); // Example formatting
});

module.exports = reactionSchema;