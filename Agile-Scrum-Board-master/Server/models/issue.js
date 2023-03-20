const mongoose = require('mongoose');

const JCommentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});

const JIssueSchema = new mongoose.Schema({
  // id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['Story', 'Task', 'Bug'], required: true },
  status: { type: String, enum: ['Backlog', 'Selected', 'InProgress', 'Done'], required: true },
  priority: { type: String, enum: ['Lowest', 'Low', 'Medium', 'High', 'Highest'], required: true },
  listPosition: { type: Number, required: true },
  description: { type: String, required: true },
  estimate: { type: Number, required: false },
  timeSpent: { type: Number, required: false },
  timeRemaining: { type: Number, required: false },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  reporterId: { type: String, required: true },
  userIds: { type: [String], required: true },
  createdBy: { type: String, required: true },
  // ,
  // comments: { type: [JCommentSchema], required: true },
  // projectId: { type: String, required: true }
});

const JIssueModel = mongoose.model('JIssue', JIssueSchema);

module.exports = JIssueModel;