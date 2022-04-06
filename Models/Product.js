const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    rate: {
        type: Schema.Types.Number,
        required: true,
        default: 0,
        min: 0,
        max: 5
    },
    count: {
        type: Schema.Types.Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

const ProductSchema = new Schema(
	{
		name: {
			type: Schema.Types.String,
			required: true,
		},
		description: {
			type: Schema.Types.String,
			required: true,
			default: "",
		},
        imageUrl: {
            type: Schema.Types.String,
            default:""
        },
        price: {
            type: Schema.Types.Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Schema.Types.Number,
            required: true,
            min: 0
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false
        },
        rating: {
            type: RatingSchema,
            required: false
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
	},  
	{
		timestamps: true,
		versionKey: false,
	}
);

module.exports = {
    model: mongoose.model("Product", ProductSchema)
}