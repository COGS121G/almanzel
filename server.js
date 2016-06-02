//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var pg = require('pg');
var app = express();

//client id and client secret here, taken from .env (which you need to create)
dotenv.load();

//connect to database
var conString = process.env.DATABASE_CONNECTION_URL;

//Configures the Template engine
app.engine('html', handlebars({ defaultLayout: 'layout', extname: '.html' }));
app.set("view engine", "html");
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat',
saveUninitialized: true,
resave: true}));

//set environment ports and start application
app.set('port', process.env.PORT || 3000);

//routes
app.get('/', function(req, res){
  res.render('index');
});

app.get('/index1', function(req, res) {
  res.render('index1');
});

app.get('/index2', function(req, res) {
  res.render('index2');
});

app.get('/index3', function(req, res) {
  res.render('index3');
});

app.get('/index4', function(req, res) {
  res.render('index4');
});

app.get('/map', function(req, res) {
  res.render('map');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

/*
var community_querry = 'SELECT c.community, COUNT(*) AS total \
FROM cogs121_16_raw.arjis_crimes c \
WHERE c.community <> \'\' \
GROUP BY c.community \
ORDER BY total ASC'
*/

var sanDiego = "'%IEG%'";
var vista = "'%IST%'";
var elC = "'%AJO%'";
var nulll ="''";
var nonString = "'%non%'";
var withString = "'%with%'";
var maleString = "'%male%'";

var crime_query = 'SELECT DISTINCT community, COUNT(community) AS community_occurence \
FROM cogs121_16_raw.arjis_crimes t \
WHERE t.community NOT LIKE'+ nulll+' AND\
t.community NOT LIKE'+ sanDiego+' AND \
t.community IS NOT NULL \
GROUP BY community \
HAVING count(community)>=120 \
ORDER BY community_occurence DESC \
LIMIT 10;'

var family_querry = 'SELECT Subregional Area AS area, Percentage, Household Type AS famType \
FROM cogs121_16_raw.hhsa_san_diego_demographics_household_compos_perc_2012_norm fam \
WHERE fam.famType LIKE '+nonString+' OR \
fam.famType NOT LIKE '+withString+' AND\
fam.famType NOT LIKE '+maleString+' \
GROUP BY area ;'

var pgVar = require('pg');

function processQuery(req, res, pg, query){
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(query, function(err, result) {
            done();

            if(err) {
              return console.error('error running query', err);
            }

            res.json(result.rows);
            client.end();

        });
    });
}

app.get('/delphidata_crime', function (req, res) {
    processQuery(req, res, pgVar, crime_query);
});

app.get('/delphidata_family', function (req, res) {
    processQuery(req, res, pgVar, family_query);
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
