<!-- Start Global Variables Definition -->
var WIDTH = 900, HEIGHT = 600; //originally 1600
<!-- End Global Variables Definition -->

function renderTotalHateCrimeIncidents(svgId) {

	var width = WIDTH, height = HEIGHT;
	var margin = {top: 20, right: 20, bottom: 30, left: 40};

    console.log("renderTotalHateCrimeIncidents function called with " + svgId + "with canvas width: " + width + " and convas height: " + height + " top margin: " + margin.top + " bottom margin: " + margin.bottom + " left margin: " + margin.left + " right margin: " + margin.right);

      var svg = d3.select(svgId).append("svg")
                         .attr("width", width - margin.left - margin.right)
                         .attr("height", height - margin.top - margin.bottom);

     console.log("svg: " + svg + " svg width: " + svg.style("width") + " svg height: " + svg.style("height"));                   

    var parseTime = d3.timeParse("%Y");
    var	bisectDate = d3.bisector(function(d) { return d.Year; }).left;

	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	var line = d3.line()
    	.x(function(d) { return x(d.Year); })
    	.y(function(d) { return y(d.Incidents); });

	var g = svg.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json("data/totalincidents.json", function(error, data) {
    	if (error) throw error;

    data.forEach(function(d) {
      d.Year = parseTime(d.Year);
      d.Incidents = +d.Incidents;
      console.log("Year:" + d.Year + " Incidents: " + d.Incidents);
    });

    x.domain(d3.extent(data, function(d) { return d.Year; }));
    //y.domain([d3.min(data, function(d) { return d.Incidents; }), d3.max(data, function(d) { return d.Incidents; })]);
    y.domain([0, d3.max(data, function(d) { return d.Incidents; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(6).tickFormat(function(d) { return parseInt(d / 1000) + "k"; }))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Total Hate Crime Incidents)");

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
      	.attr("dy", ".31em");

    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]);
      var i = bisectDate(data, x0, 1);
      var d0 = data[i - 1];
      var d1 = data[i];
      console.log("i: " + i + " x0: " + x0 + " d0: " + d0 + " d1: " + d1);
         /* d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.Incidents) + ")");
      focus.select("text").text(function() { return d.Incidents; });
      focus.select(".x-hover-line").attr("y2", height - y(d.Incidents));
      focus.select(".y-hover-line").attr("x2", width + width);
      */
    }
  });

}


  renderTotalHateCrimeIncidents("#totalincidents-svg");


