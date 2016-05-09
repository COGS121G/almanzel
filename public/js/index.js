
(function(d3) {
  "use strict";

  // ASSIGNMENT PART 1B
  // Grab the delphi data from the server
  d3.json("/delphidata", function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    makeDelphiChart(data);
    console.log("Data", data);
  });

})(d3);  



makeDelphiChart = function(data) {



var margin = {top: 20, right: 10, bottom: 100, left: 80},
      width = 960 - margin.right - margin.left;

  var innerWidth  = width  - margin.left - margin.right;

  var rating = d3.max( data.map(function(d){ return d.community_occurence; }) );
  var innerHeight = rating/6 - margin.top  - margin.bottom;



  var xScale = d3.scale.ordinal().rangeRoundBands([0, innerWidth+1], .1);
  var yScale = d3.scale.linear().range([innerHeight, 0]);

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong> Total Crimes :</strong> <span style='color:red'>" + d + "</span>";
  });

  // Define the chart
  var chart = d3
                .select(".chart")
                .append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", innerHeight + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" +  margin.left + "," + margin.right + ")");

   // Render the chart
  xScale.domain(data.map(function (d){ return d.community; }));
  yScale.domain([0, d3.max(data, function(d) {
        return rating;
    })]);



  chart.call(tip);

  var node = chart
    .selectAll(".bar")
    .data(data.map(function(d){ return d.community_occurence; }))
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) {
     return ((innerWidth / data.length)*i) + 45; })
    .attr("width", xScale.rangeBand()-10)
    .attr("y", function(d) { 
    return innerHeight - d*(innerHeight/rating); })
    .attr("height", function(d) { return innerHeight*d/rating;  })
    .on("mouseover",tip.show)
    .on("mouseout", tip.hide);

  // Orient the x and y axis
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxis = d3.svg.axis().scale(yScale).orient("left");

  chart
        .append("g").attr("class", "x axis")
        .call(xAxis)
        .attr("transform", "translate(30," + innerHeight + ")")
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("font-size","14px")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" );





  // TODO: Append Y axis
  chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .attr("transform", "translate(" + 30 + "," + 0 + ")");


};