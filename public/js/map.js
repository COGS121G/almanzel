(function(d3) {
  "use strict";

  var adults = $("#mapdiv").attr("data-adults");
  var child = $("#mapdiv").attr("data-children");
  var inc = $("#mapdiv").attr("data-income");
  var race = $("#mapdiv").attr("data-race");
  var trans = $("#mapdiv").attr("data-transportation");
  console.log("adults" + adults);
  console.log("child" + child);
  console.log("inc" + inc);
  console.log("race" + race);
  console.log("trans" + trans);
  var communityData = d3.json("/communities", function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    makeMap(data);
  });

})(d3);  


function makeMap(data) {

  var max = d3.max( data.map(function(d){ return parseInt(d.total); }) );

  var map = L.map('map').setView([33.0, -116.92], 10);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 18,
    id: 'p9kim.ppgijk1l',
    accessToken: 'pk.eyJ1IjoianlwMDMzIiwiYSI6ImNpbzNvNjE4MzAxYWp2emx6cnB1bHFodTAifQ.2xzuBa4B89Vjod3fEYSFkA'
  }).addTo(map);;

 // map.dragging.disable();
  map.touchZoom.disable();
 // map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.keyboard.disable();


  var svg = d3.select(map.getPanes().overlayPane).append("svg"),
  g = svg.append("g").attr("class", "leaflet-zoom-hide");


  d3.json("https://raw.githubusercontent.com/COGS121G/almanzel/master/sdcounty.json", function(error, collection) {
    if (error) throw error;

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {

        return "<strong>Location Stats:</strong> <span style='color: #FAD61E;'>" + d.properties.NAME + "</span>";
      });

    var transform = d3.geo.transform({point: projectPoint}),
        path = d3.geo.path().projection(transform);

    g.call(tip);


    var feature = g.selectAll("path")
      .data(collection.features)
      .enter()
      .append("path")
      .attr("id", function(d){return d.properties.NAME; } )
      .attr("class", "map_piece")
      .on("click", function(d) {
         printInfo(d.properties.NAME, data);
        $('html,body').animate({
            scrollTop: $(".locationInfo").offset().top},
                'slow');
          })
       .on("mouseover",tip.show)
       .on("mouseout", tip.hide);

    map.on("viewreset", reset);
    reset();

    // Reposition the SVG to cover the features.
    function reset() {
      var bounds = path.bounds(collection),
          topLeft = bounds[0],
          bottomRight = bounds[1];

      svg .attr("width", bottomRight[0] - topLeft[0])
          .attr("height", bottomRight[1] - topLeft[1])
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");

      g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

      feature.attr("d", path)
      .style("fill", function(d, i){ return mapColor(d.properties.NAME, data, max); } );
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }
    });

   legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(50,30)")
    .style("font-size","12px")
    .call(d3.legend)
}

function mapColor(name, data, max) {
  var color = d3.scale.linear()
  .domain([0, .02, .2])
  .range(["darkgreen", "green", "red"]);

  for(var i in data) {
    if( data[i].community == name ) {
      return color(data[i].total/max);
    }
  }

  return "grey ";
}

function printInfo(name, data) {
  for(var i in data) {
    if( data[i].community == name ) {
      console.log();
      //$('.communityName').css('display', 'none');
      $('#communityInfo').css('display', 'block');
      $('.communityName').text(name);
      $('#commInfo').text(data[i].total);
    }
  }
}