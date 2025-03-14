const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.ObjectId,
        require: true,
    },
    imageName: {
        type: String,
        require: true,
        trim: true,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("imageCollection", imageSchema);
