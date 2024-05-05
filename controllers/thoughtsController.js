const { Thoughts, User } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thoughts.find().populate({ path: 'reactions', select: '-__v' });
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single thought
  async getThoughtById(req, res) {
    try {
      const thought = await Thoughts.findOne({ _id: req.params.id })
        .populate({ path: 'reactions', select: '-__v' });
      if (!thought) {
        return res.status(404).json({ message: 'No thoughts with that ID' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new thought
  async createThought(req, res) {
    try {
      const dbThoughtsData = await Thoughts.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtsData._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: 'Thoughts created, but found no user with that ID',
        });
      }
      res.json(dbThoughtsData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      console.log('Deleting thoughts...');
      
      const thought = await Thoughts.findOneAndDelete({ _id: req.params.id });
      console.log('Thoughts:', thought);
      
      if (!thought) {
        console.log('No thoughts found with this id:', req.params.id);
        return res.status(404).json({ message: 'No thoughts with this id!' });
      }
      
      const user = await User.findOneAndUpdate(
        { thoughts: req.params.id },
        { $pull: { thoughts: req.params.id } },
        { new: true }
      );
      console.log('User:', user);
      
      if (!user) {
        console.log('Thoughts deleted but no user found with this id:', req.params.id);
        return res.status(404).json({
          message: 'Thoughts deleted but no user with this id!',
        });
      }
      
      console.log('Thoughts successfully deleted!');
      res.json({ message: 'Thoughts successfully deleted!' });
    } catch (err) {
      console.error('Error deleting thoughts:', err);
      res.status(500).json(err);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thoughts with this id!' });
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a reaction to a thought.
  async addReaction(req, res) {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thoughts with this id!' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove a reaction from a thought.
  async removeReaction(req, res) {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thoughts with this id!' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
