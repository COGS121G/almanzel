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

app.get('/communities', function (req, res) {
  pg.connect(conString, function(err, client, done) {

    if(err) {
      return console.error('error fetching client from pool', err);
    }

    var q = 'SELECT c.community, COUNT(*) AS total \
    FROM cogs121_16_raw.arjis_crimes c \
    WHERE c.community <> \'\' \
    GROUP BY c.community \
    ORDER BY total ASC';

    client.query( q, function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      res.json(result.rows);
      client.end();
      return { delphidata: result };
    });
  });
  return { delphidata: "No data found" };
});

app.get('/delphidata', function (req, res) {

  pg.connect(conString, function(err, client, done) {

    if(err) {
      return console.error('error fetching client from pool', err);
    }

    var sanDiego = "'%IEG%'";
    var vista = "'%IST%'";
    var elC = "'%AJO%'";
    var nulll ="''";

    var myQuerry = 'SELECT DISTINCT community, COUNT(community) AS community_occurence \
    FROM cogs121_16_raw.arjis_crimes t \
    WHERE t.community NOT LIKE'+ nulll+' AND\
    t.community NOT LIKE'+ sanDiego+' AND \
    t.community IS NOT NULL \
    GROUP BY community \
    HAVING count(community)>=120 \
    ORDER BY community_occurence DESC \
    LIMIT 10;'

    console.log("sql");
    /*
    var myQuerry = 'SELECT gender, SUM(number_of_respondents) AS sum \
    FROM cogs121_16_raw.cdph_smoking_prevalence_in_adults_1984_2013 t \
    WHERE t.year = 2003 \
    GROUP BY t.gender \
    ORDER BY sum ASC';
    */

    client.query(myQuerry , function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }

      //json
      res.json(result.rows);
      client.end();

      return { delphidata: result };
    });
  });


  return { delphidata: "No data present." }
});



app.get('/familyData', function (req, res) {

  pg.connect(conString, function(err, client, done) {

    if(err) {
      return console.error('error fetching client from pool: familyData', err);
    }

    var nonString = "'%non%'";
    var withString = "'%with%'";
    var maleString = "'%male%'";


    var myFamQuerry = 'SELECT Subregional Area AS area, Percentage, Household Type AS famType \
    FROM cogs121_16_raw.hhsa_san_diego_demographics_household_compos_perc_2012_norm fam \
    WHERE fam.famType LIKE '+nonString+' OR \
    fam.famType NOT LIKE '+withString+' AND\
    fam.famType NOT LIKE '+maleString+' \
    GROUP BY area ;'

    console.log("sqlFam");

    client.query(myFamQuerry , function(err, result) {
      done();
      if(err) {
        return console.error('error running Famquery', err);
      }

      res.json(result.rows);
      client.end();
      return { familyData: result };
    });
  });
  return { familyData: "No data present." }
});


http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
