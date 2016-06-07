
(function(d3) {
  "use strict";

  // ASSIGNMENT PART 1B
  // Grab the delphi data from the server
  var offsetWidth = document.getElementById('crimeCol').offsetWidth;
  var offsetHeight = document.getElementById('crimeCol').offsetHeight;

    console.log(offsetWidth);
    console.log(offsetHeight);

  d3.json("/delphidata", function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    makeDelphiChart(data, offsetWidth, offsetHeight);
  });

})(d3);

makeDelphiChart = function(data, width, height) {

  var margin = {top: 20, right: 80, bottom: 100, left: 20};
  var innerWidth  = width  - margin.left - margin.right;

  var rating = d3.max( data.map(function(d){ return d.community_occurence; }) );
  var innerHeight = height - margin.top  - margin.bottom;

  var xScale = d3.scale.ordinal().rangeRoundBands([0, innerWidth+1], .1);
  var yScale = d3.scale.linear().range([innerHeight, 0]);

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong> Total Crimes :</strong> <span style='color: #FAD61E;'>" + d + "</span>";
  });

  // Define the chart
  var chart = d3
                .select(".chart")
                .append("svg")
                .classed("svg-container", true)
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 600 400")
                .classed("svg-content-responsive", true);
                // .attr("transform", "translate(" +  margin.left + "," + margin.right-30 + ")");

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
    .attr("x", function(d, i) { return ((innerWidth / data.length)*i) + 45; })
    .attr("width", xScale.rangeBand()-7)
    .attr("y", function(d) { return innerHeight - d*(innerHeight/rating); })
    .attr("height", function(d) { return innerHeight*d/rating;  })
    .on("click", function(d) {
          d3.selectAll(".bar").style("fill", "#278FC2");
          d3.select(this).style("fill", "#F3B529");
         printCrimeInfo(d);
      })
    .on("dblclick", function(d) {
        d3.select(this).style("fill", "#278FC2");
      })
    .on("mouseover",tip.show)
    .on("mouseout", tip.hide)
    ;

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

  chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .attr("transform", "translate(" + 36 + "," + 0 + ")");
};

function printCrimeInfo(data) {
  console.log(data);
  $('#crimeInfo').text(data);
}
