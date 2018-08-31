const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

module.exports = router;

// Load IdeaModel
require('../models/idea');
const Idea = mongoose.model('ideas');

// Add all ideas
router.get('/', ensureAuthenticated, (req, res) => {
	Idea.find({})
		.sort({ date: 'desc' })
		.then(ideas => {
			res.render('ideas/all', {
				ideas: ideas,
			});
		});
});

// Edit Idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			res.render('ideas/edit', {
				idea: idea
			})
		});
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('ideas/add');
});

// Process form
router.post('/', ensureAuthenticated, (req, res) => {
	let errors = [];
	if (!req.body.title) {
		errors.push({ text: "Please add a title" });
	}
	if (!req.body.details) {
		errors.push({ text: "Please enter the details" });
	}
	if (errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details,
		};
		new Idea(newUser).save().then(idea => {
			req.flash('success_msg', 'Idea Added Successfully!');
			res.redirect('/ideas');
		});
	}
});

// Submit the edited form
router.put('/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
		.then(idea => {
			idea.title = req.body.title;
			idea.details = req.body.details;

			idea.save()
				.then(idea => {
					req.flash('success_msg', 'Idea Updated Successfully!');
					res.redirect('/ideas');
				});
		});
});

// Delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
	Idea.remove({ _id: req.params.id })
		.then(() => {
			req.flash('success_msg', 'Idea Removed Successfully!');
			res.redirect('/ideas');
		});
});
