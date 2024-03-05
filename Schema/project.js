const mongoose=require('mongoose');

const projectSchema = new mongoose.Schema({
    projectID:{type:String, required: true},
    name: { type: String, required: true },
    description: {type: String, required: true},
    constituency: {type: String, required: true},
    comments:[String]
});
const project = mongoose.model('project',projectSchema);

module.exports = project;