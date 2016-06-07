(function(d3) {
  "use strict";

  var adults = $("#mapdiv").attr("data-adults");
  var child = $("#mapdiv").attr("data-children");
  var inc = $("#mapdiv").attr("data-income");
  var race = $("#mapdiv").attr("data-race");
  var trans = $("#mapdiv").attr("data-transportation");


      makeLegend();
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
            scrollTop: $("#locationInfo").offset().top},
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
}

function mapColor(name, data, max) {
  var color = d3.scale.linear()
  .domain([0, .02, .2])
  .range(["green", "red"]);

  for(var i in data) {
    if( data[i].community == name ) {
      return color(data[i].total/max);
    }
  }

  return "grey ";
}

function printInfo(name, data) {


  for(var i in data) {

      //var locInfo = {};
      //locInfo[data] = k;

    //for(var i in data) {
    //if( data[i].community == name ) {
      //map[name] = k;
      //console.log("**name " +name);
    //}
//    else {
  //    console.log("data "+data[i].community)
    //  console.log("name " +name)
  //  }
 // }


    if( data[i].community == name ) {
      console.log();
      //$('.communityName').css('display', 'none');
      $('#communityInfo').css('display', 'block');
      $('.communityName').text(name);
      $('#commInfo').text(data[i].total);
      $('#crimeInfo').text(data[i].total);


      if(name == "ESCONDIDO"){
        $('#locSummary').text("Escondido is a city located in San Diego County's North County region, 30 miles (48 km) northeast of Downtown San Diego, California. The city occupies a shallow valley ringed by rocky hills. Incorporated in 1888, it is one of the oldest cities in San Diego County. The city had a population of 143,911 in the 2010 census. ");
      }

      if(name == "VISTA"){
        $('#locSummary').text("Vista is a medium-sized city within the San Diego Metropolitan Area and had a population of 93,834 at the 2010 census. Vista also includes portions of unincorporated San Diego County to north and east, with a county island in the central west, which is within its sphere of influence. Located just seven miles inland from the Pacific Ocean, it has a Mediterranean climate.");
      }

      if(name == "FALLBROOK"){
        $('#locSummary').text("Fallbrook is situated immediately east of the U.S. Marine Corps' Camp Pendleton. Fallbrook is known for its avocado groves and claims the title 'Avocado Capital of the World.'' It is often called or known as The Friendly Village. The Avocado Festival is held in the downtown strip annually and frequently draws large crowds.");
      }

      if(name == "OCEANSIDE"){
        $('#locSummary').text("Oceanside is a coastal city located on California's South Coast. It is the third-largest city in San Diego County, California. The city had a population of 167,086 at the 2010 census. Together with Carlsbad and Vista, it forms a tri-city area. Oceanside is located just south of Marine Corps Base Camp Pendleton.");
      }
      if(name == "CARLSBAD"){
        $('#locSummary').text("Carlsbad is a seaside resort city occupying a 7-mile (11 km) stretch of Pacific coastline in northern San Diego County, California. The city is 87 miles (140 km) south of Los Angeles and 35 miles (56 km) north of downtown San Diego and is part of the San Diego-Carlsbad, CA Metropolitan Statistical Area. Referred to as The Village by the Sea by locals, the city is a tourist destination. The city's estimated 2014 population was 112,299.");
      }
      if(name == "SAN MARCOS"){
        $('#locSummary').text("San Marcos is a city in the North County region of San Diego County in the U.S. state of California. As of the 2010 census, the city's population was 83,781. It is the site of California State University San Marcos. The city is bordered by Escondido to the east, Encinitas to the southwest, Carlsbad to the west, and Vista to the northeast.");
      }
      if(name == "VALLEY CENTER"){
        $('#locSummary').text("Valley Center is a community in a small rural town. The community is largely based on agriculture and farming with a few gated communities. A close knit community, Valley Center is known for its Western Days Parade and annual Fourth of July fireworks display in the community park. Historically, the growth of Valley Center has been slowed by lower densities including a minimum of 2 acres (8,100 m2) being required for most parcels.");
      }

      if(name == "POWAY"){
        $('#locSummary').text("Poway is a city in San Diego County, California. Originally an unincorporated community in the county, Poway officially became a city on December 1, 1980. Poway's rural roots gave rise to its slogan The City in the Country. As of the 2010 census the city had a population of 47,811. ");
      }
      if(name == "RAMONA"){
        $('#locSummary').text("The Ramona community plan area consists of approximately 84,000 acres situated east of the city of Poway and north of Lakeside. To the east lie the North Mountain and Central Mountain subregions. ");
      }
      if(name == "LAKESIDE"){
        $('#locSummary').text("Lakeside has long held a reputation as a cowboy town and rodeo town, due to the rural setting, the prevalence of ranches and the abundant horse ownership in the area, as well as hosting a permanent rodeo facility, the Lakeside Rodeo Grounds. There are a number of parks with outdoor trails for hiking, biking and equestrian riding. Also located in Lakeside is the trailhead for the climb to the summit of El Cajon Mountain, nicknamed locally as El Capitan for its resemblance to the famous Yosemite cliff, which dominates the view of the mountains northeast of Lakeside.");
      }
      if(name == "SANTEE"){
        $('#locSummary').text("Unlike most of the county's coastal cities, Santee still has sizable portions of vacant land suitable for development. It is a growing suburban community that in recent years has added upscale housing, a major corporate business park and expansive shopping centers, along with a destination recreational complex called Sportsplex USA Santee.");
      }
      if(name == "EL CAJON"){
        $('#locSummary').text("El Cajon is a city in San Diego County, California, United States. Nestled in a valley surrounded by mountains, the city has acquired the nickname of \"The Big Box\".");
      }
      if(name == "LA MESA"){
        $('#locSummary').text("La Mesa is a city in Southern California, located 9 miles (14 km) east of Downtown San Diego in San Diego County. The population was 57,065 at the 2010 census, up from 54,749 at the 2000 census. Its civic motto is \"the Jewel of the Hills.\"");
      }
      if(name == "LEMON GROVE"){
        $('#locSummary').text("A city with unique historic roots, Lemon Grove still exhibits community pride and spirit, boasting about having the \"Best Climate on Earth\", its motto for more than 100 years. Centrally located in the southwest portion of San Diego County, Lemon Grove is only nine miles from downtown San Diego, and only 12 miles from the airport.");
      }
      if(name == "SPRING VALLEY"){
        $('#locSummary').text("Spring Valley is named for the natural spring located there. It was long the home of the Kumeyaay tribe, who called it Neti or Meti. Spanish conquerors drove off the natives and used the area for cattle, calling it El aguaje de San Jorge (St. George's Spring).");
      }
      if(name == "ALPINE"){
        $('#locSummary').text("The Alpine plan area covers 108 square miles situated in the foothills of the Cuyamaca Mountains. The area is rugged and diverse, ranging from densely vegetated lower drainageways of 1500' elevation, to semi-arid hilly terrain, to the peaks of Viejas and El Cajon Mountains with elevations of over 4100'. ");
      }
      if(name == "JAMUL"){
        $('#locSummary').text("Jamul is one of several small rural or semi-rural communities in its surrounding area. It is still rural in character since it has no sewer system and imported water service only in the northwestern portion of the area. ");
      }
      if(name == "CORONADO"){
        $('#locSummary').text("Situated just across the Big Bay from downtown San Diego, Coronado is most notably known for two famous structures, the historic Hotel del Coronado and the distinctive San Diego-Coronado Bridge. But beyond these architectural marvels, the quaint island community of Coronado offers visitors an experience that is a world apart. Coronado's coastline offers gentle surf and sparkling sand beaches (courtesy of the mineral Mica) that draw in visitors from around the world. ");
      }
      if(name == "NATIONAL CITY"){
        $('#locSummary').text("National City is the second oldest city in San Diego County and has a historic past and a vibrant community culture. It’s home to a new waterfront marina, an extensive shopping scene and a number of lodging options including the best hotel deals in San Diego.");
      }
      if(name == "CHULA VISTA"){
        $('#locSummary').text("The City of Chula Vista is located at the center of one of the richest cultural, economic and environmentally diverse zones in the United States. It is the second-largest City in San Diego County with a population of 250,000. Chula Vista boasts more than 50 square miles of coastal landscape, canyons, rolling hills, mountains, quality parks, and miles of trails. Chula Vista is a leader in conservation and renewable energy, has outstanding public schools, and has been named one of the top safest cities in the country.");
      }
      if(name == "SOUTH BAY"){
        $('#locSummary').text("Located south of downtown San Diego and just north of the Mexico border lies the area known as San Diego's South Bay, the gateway to Baja California. The National City neighborhood of the South Bay has a strong military presence; its three-mile port area along the San Diego Bay is part of Naval Base San Diego, the largest U.S. Naval base on the west coast.");
      }
    }
  }
}

function makeLegend() {

  var legendRectSize = 18,
          legendSpacing = 4;

  var color = d3.scale.ordinal()
      .domain(["Best Fit", " a", " b", " c", " d", " e", "Worst Fit", "No Data"])
      .range(["green", "#BF7456","#C17256", "#ED524F", "#F05650", "#FE6565", "red", "grey"]);

  var legend = d3.select("#mapoverlay").append('svg')
    .append("g")
    .selectAll("g")
    .data(color.domain())
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize;
        var x = 0;
        var y = i * height;
        return 'translate(' + x + ',' + y + ')';
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });
}
