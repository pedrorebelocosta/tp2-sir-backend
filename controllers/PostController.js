const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');

const EXCLUDE_FIELDS = { email: 0, password: 0 };

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
	createLike: async function(req, res, next) {
		const authHeader = req.headers.authorization;
		const decodedToken = jwt.decode(authHeader.split(' ')[1]);
		const postId = req.params.id;

		const foundLike = await Post.findOne({ _id: postId, likes: new ObjectId(decodedToken._id) });

		if (foundLike) {
			res.status(302).end();
			return;
		}

		const liked = await Post.findOneAndUpdate(
			{ _id: postId },
			{ $push: { likes: new ObjectId(decodedToken._id) }},
			{ new: true }
		);

		if (liked) return res.status(200).json(liked);
		else return res.status(400).end();
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
	readLikes: async function (req, res, next) {
		// get all the user ids, save them
		const postId = req.params.id;
		const post = await Post.findOne({ _id: postId });
		const usersThatLiked = post.likes.map((elem) => new ObjectId(elem));

		User.find(
			{ _id: { $in: usersThatLiked }},
			EXCLUDE_FIELDS,
			(err, docs) => { 
				if (err) return next(err);
				else return res.status(200).json(docs);
			}
		);
	},
	update: async function (req, res, next) {
		const authHeader = req.headers.authorization;
		const decodedToken = jwt.decode(authHeader.split(' ')[1]);
		const postId = req.params.id;
		const post = await Post.findOne({ _id: postId });

		// Post doesn't exist?
		if (!post) return next();
		// Requestor is not post author?
		if (!(post.author == decodedToken._id)) {
			return res.status(403).end();
		}

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId }, req.body,
			{ new: true }
		);

		if (!updatedPost) return res.status(500).end();
		return res.status(200).json(updatedPost);
	},
	delete: async function (req, res, next) {
		const authHeader = req.headers.authorization;
		const decodedToken = jwt.decode(authHeader.split(' ')[1]);
		const postId = req.params.id;
		const post = await Post.findOne({ _id: postId });
		
		// Post doesn't exist?
		if (!post) return next();
		// Requestor is not post author?
		if (!(post.author == decodedToken._id)) {
			return res.status(403).end();
		}

		Post.findOneAndRemove({ _id: postId }, async (err, doc) => {
			if (err) return next(err);
			await User.findOneAndUpdate(
				{ _id: doc.author },
				{ $pull: { posts: doc._id } }
			);
			return res.status(202).json(doc);
		});
	},
	deleteLikes: async function (req, res, next) {
		const authHeader = req.headers.authorization;
		const decodedToken = jwt.decode(authHeader.split(' ')[1]);
		const postId = req.params.id;

		const disliked = await Post.findOneAndUpdate(
			{ _id: postId },
			{ $pull: { likes: new ObjectId(decodedToken._id) }},
			{ new: true }
		);

		if (disliked) {
			return res.status(200).json(disliked);
		}
		else return res.status(400).end();
	}
}