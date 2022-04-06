const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
    {
		name: {
			type: Schema.Types.String,
			required: true,
		},    
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
	},  
	{
		timestamps: true,
		versionKey: false,
	}
);

module.exports = {
    model: mongoose.model("Category", CategorySchema)
}