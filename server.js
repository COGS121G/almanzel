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

app.get('/delphidata', function (req, res) {
  // TODO
  // Connect to the DELPHI Database and return the proper information
  // that will be displayed on the D3 visualization
  // Table: Smoking Prevalance in Adults
  // Task: In the year 2003, retrieve the total number of respondents
  // for each gender. 
  // Display that data using D3 with gender on the x-axis and 
  // total respondents on the y-axis.

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


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
