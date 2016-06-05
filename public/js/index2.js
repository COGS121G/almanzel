
(function(d3) {
  "use strict";

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var svg = d3.select("#demoChart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  // ASSIGNMENT PART 1B
  // Grab the delphi data from the server
d3.json("/demographics", function(err, data) {
      if (err) throw err;

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.Black); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.Black; });
});

function type(d) {
  d.population = +d.population;
  return d;}


  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   makeDemoChart(data);
  // });

})(d3);  


makeDemoChart = function(data) {


// d3.csv("data.csv", type, function(error, data) {

// }



  // var margin = {top: 20, right: 10, bottom: 100, left: 80},
  //     width = 960 - margin.right - margin.left;

  // var innerWidth  = width  - margin.left - margin.right;

  // var rating = d3.max( data.map(function(d){ return d.community_occurence; }) );
  // var innerHeight = rating/6 - margin.top  - margin.bottom;

  // var xScale = d3.scale.ordinal().rangeRoundBands([0, innerWidth+1], .1);
  // var yScale = d3.scale.linear().range([innerHeight, 0]);

  // var tip = d3.tip()
  // .attr('class', 'd3-tip')
  // .offset([-10, 0])
  // .html(function(d) {
  //   return "<strong> Total Crimes :</strong> <span style='color: #FAD61E;'>" + d + "</span>";
  // });

  // // Define the chart
  // var chart = d3
  //               .select("chart2")
  //               .append("svg")
  //               .attr("width", width + margin.right + margin.left)
  //               .attr("height", innerHeight + margin.top + margin.bottom)
  //               .append("g")
  //               .attr("transform", "translate(" +  margin.left + "," + margin.right + ")");

  //  // Render the chart
  // xScale.domain(data.map(function (d){ return d.community; }));
  // yScale.domain([0, d3.max(data, function(d) {
  //       return rating;
  //   })]);

  // chart.call(tip);

  // var node = chart
  //   .selectAll(".bar")
  //   .data(data.map(function(d){ return d.community_occurence; }))
  //   .enter().append("rect")
  //   .attr("class", "bar")
  //   .attr("x", function(d, i) {
  //    return ((innerWidth / data.length)*i) + 45; })
  //   .attr("width", xScale.rangeBand()-10)
  //   .attr("y", function(d) { 
  //   return innerHeight - d*(innerHeight/rating); })
  //   .attr("height", function(d) { return innerHeight*d/rating;  })
  //   .on("mouseover",tip.show)
  //   .on("mouseout", tip.hide);

  // // Orient the x and y axis
  // var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  // var yAxis = d3.svg.axis().scale(yScale).orient("left");

  // chart
  //       .append("g").attr("class", "x axis")
  //       .call(xAxis)
  //       .attr("transform", "translate(30," + innerHeight + ")")
  //       .selectAll("text")  
  //           .style("text-anchor", "end")
  //           .attr("font-size","14px")
  //           .attr("dx", "-.8em")
  //           .attr("dy", ".15em")
  //           .attr("transform", "rotate(-65)" );


  // // TODO: Append Y axis
  // chart.append("g")
  //       .attr("class", "y axis")
  //       .call(yAxis)
  //       .attr("transform", "translate(" + 30 + "," + 0 + ")");


};