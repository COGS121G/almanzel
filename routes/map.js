// var models = require("../models");

exports.view = function(req, res) {

	var adults = req.query.adults;
	var children = req.query.children;
	var income = req.query.income;
	var race = req.query.income;
	var transportation = req.query.transportation;

	console.log("-+- adults: "+adults+" children: "+children+" income: "+income+" race: "+race+" transportation: "+transportation);

	//render the map based on the search variables ^
	res.render('map');
};