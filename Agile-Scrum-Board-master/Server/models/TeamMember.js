const mongoose = require('mongoose')
const TeammMemberSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true // add unique constraint
    },
    adminId:{
        type:String,  
        required: true,    
    }
  });
  const TeamMemberModel = mongoose.model('TeamMember', TeammMemberSchema);

  module.exports = TeamMemberModel;