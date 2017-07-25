<!-- Start Global Variables Definition -->
var WIDTH = 960, HEIGHT = 700; 
<!-- End Global Variables Definition -->

function renderTotalHateCrimeIncidents(svgId) {

	
	var margin = {top: 40, right: 20, bottom: 50, left: 70},
      width = WIDTH  - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

    console.log("renderTotalHateCrimeIncidents function called with " + svgId + "with canvas width: " + width + " and convas height: " + height + " top margin: " + margin.top + " bottom margin: " + margin.bottom + " left margin: " + margin.left + " right margin: " + margin.right);

      var svg = d3.select(svgId).append("svg")
                         .attr("width", width + margin.left + margin.right)
                         .attr("height", height + margin.top + margin.bottom);

  console.log("svg: " + svg + " svg width: " + svg.style("width") + " svg height: " + svg.style("height"));                   


	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	var line = d3.line()
      .defined(function(d) { return d; })
    	.x(function(d) { return x(d.Year); })
    	.y(function(d) { return y(d.Incidents); });

	var g = svg.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json("data/totalincidents.json", function(error, data) {
    	if (error) throw error;

    data.forEach(function(d) {
      d.Year = +d.Year;
      d.Incidents = +d.Incidents;
      console.log("Year:" + d.Year + " Incidents: " + d.Incidents);
    });

   
    x.domain([2004, 2016]);
    //y.domain([d3.min(data, function(d) { return d.Incidents; }) - 500, d3.max(data, function(d) { return d.Incidents; }) + 500]);
    y.domain([5000, d3.max(data, function(d) { return d.Incidents; })+ 500]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("text")
        .attr("transform","translate(" + (width/2) + " ," +(height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .attr("fill", "#5D6971")
        .attr("font-size", "16")
        .text("Incident Year");

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(7).tickFormat(function(d) { return d }))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height /2))
        .attr("dy", "1.25em")
        .style("text-anchor", "middle")
        .attr("fill", "#5D6971")
        .attr("font-size", "16")
        .text("Hate Crime Incidents");


    g.append("path")
        .data([data])
        .attr("class", "line")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    g.selectAll(".dot")
        .data(data.filter(function(d) { return d; }))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", line.x())
        .attr("cy", line.y())
        .attr("stroke", "steelblue")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 9);
    
  });

}


  renderTotalHateCrimeIncidents("#totalincidents-svg");


