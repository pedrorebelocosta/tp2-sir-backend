const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

module.exports = {
	create: function (req, res, next) {
		const title = req.body.title;
		const photoUrl = req.body.photoUrl;
		const authHeader = req.headers.authorization;
		const decodedToken = jwt.decode(authHeader.split(' ')[1]);

		const newPost = new Post({ author: decodedToken._id, title, photoUrl });

		Post.create(newPost, async (err, doc) => {
			if (err) next(err);
			await User.findOneAndUpdate(
				{ _id: doc.author },
				{ $push: { posts: doc._id } }
			);
			res.status(201).json(doc);
		});
	},
	read: function (req, res, next) {
		const postId = req.params.id;
		if (postId) {
			Post.findOne({ _id: postId }, (err, doc) => {
				if (err) next(err);
				res.status(200).json(doc);
			});
		} else {
			Post.find({}, (err, docs) => {
				if (err) next(err);
				res.status(200).json(docs);
			});
		}
	},
	update: async function (req, res, next) {
		const authHeader = req.headers.authorization;
		const decodedToken = jwt.decode(authHeader.split(' ')[1]);
		const postId = req.params.id;
		const post = await Post.findOne({ _id: postId });

		// Post doesn't exist?
		if (!post) next();
		// Requestor is not post author?
		if (!(post.author == decodedToken._id)) {
			res.status(403).end();
			return;
		}

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId }, req.body,
			{ new: true }
		);

		if (!updatedPost) return res.status(500).end();
		res.status(200).json(updatedPost);
	},
	delete: async function (req, res, next) {
		const authHeader = req.headers.authorization;
		const decodedToken = jwt.decode(authHeader.split(' ')[1]);
		const postId = req.params.id;
		const post = await Post.findOne({ _id: postId });
		
		// Post doesn't exist?
		if (!post) next();
		// Requestor is not post author?
		if (!(post.author == decodedToken._id)) {
			res.status(403).end();
			return;
		}

		Post.findOneAndRemove({ _id: postId }, async (err, doc) => {
			if (err) return next(err);
			await User.findOneAndUpdate(
				{ _id: doc.author },
				{ $pull: { posts: doc._id } }
			);
			res.status(202).json(doc);
		});
	}
}