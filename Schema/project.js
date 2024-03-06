const mongoose=require('mongoose');

const projectSchema = new mongoose.Schema({
    constituency: {type: String, required: true},
    projectId: {type: String, required: true},
    projectName: {type: String, required: true},
    projectType: {type: String, required: true},
    totalBudget: {type: String, required: true},
    projectDescription: {type: String, required: true},
    comments:[String]
});
const project = mongoose.model('project',projectSchema);

module.exports = project;