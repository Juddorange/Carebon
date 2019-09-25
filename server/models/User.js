const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: String,
		email: String,
		password: String,
		picture: {
			type: String,
			default: 'https://res.cloudinary.com/justineg/image/upload/v1568024154/default-picture_0_0_ywnkls.png'
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

const User = mongoose.model('User', userSchema);
module.exports = User;
