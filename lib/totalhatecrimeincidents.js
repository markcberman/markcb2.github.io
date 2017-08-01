// Start Global Variables Definition
var WIDTH = 960, HEIGHT = 500; 
// End Global Variables Definition

function renderTotalHateCrimeIncidents(svgId) {
 
	
	var margin = {top: 40, right: 20, bottom: 50, left: 70},
      width = WIDTH  - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

    console.log("renderTotalHateCrimeIncidents function called with " + svgId + "with canvas width: " + width + " and convas height: " + height + " top margin: " + margin.top + " bottom margin: " + margin.bottom + " left margin: " + margin.left + " right margin: " + margin.right);

//add variable and properties for tooltip 
  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "Year: " + d.Year + "<br> Total Incidents: "  + d.Incidents;
  });

  //add variable and properties for annotations
  var type = d3.annotationCalloutElbow;

  var svg = d3.select(svgId).append("svg")
                         .attr("width", width + margin.left + margin.right)
                         .attr("height", height + margin.top + margin.bottom);

  console.log("svg: " + svg + " svg width: " + svg.style("width") + " svg height: " + svg.style("height"));                   

//add tooltip to svg

  svg.call(tip);


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
    });

    //add this after data has been read
  var annotations = [{
    note: {
      align: "right",
      label: "Obama elected President",
      title: "2008"
    },
    x: 290 + margin.left, y: 63 + margin.bottom * 0.25,
    dy: -20,
    dx: 0,
    subject: { text: 'A', y:"bottom" },
    id: "minimize-badge"
  },{
    note: {
      align: "left",
      label: "Obama re-elected President",
      title: "2012"
    },
    x: 580 + margin.left, y: 311 + margin.bottom * 0.25,
    dy: -30,
    dx: 0,
    subject: { text: 'B', y:"bottom" },
    id: "minimize-badge"
  }, {
      note: {
        align: "left",
        label: "The start of a divisive presidential campaign",
        title: "2015"
    },
    x: 798 + margin.left, y: 304 + margin.bottom * 0.25,
    dy: -30,
    dx: 0,
    subject: { text: 'B', y:"bottom" },
    id: "minimize-badge"
  }];
 
    console.log("Made it past instantiating the annotations object");
       
    x.domain([2004, 2016]);
    //x.domain(data.map(function(d){return year(d.YEAR)}));
    //y.domain([d3.min(data, function(d) { return d.Incidents; }) - 500, d3.max(data, function(d) { return d.Incidents; }) + 500]);
    y.domain([5000, d3.max(data, function(d) { return d.Incidents; })+ 500]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

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

    //add annotations
    var makeAnnotations = d3.annotation()
    .editMode(false)
    .type(type)
    .annotations(annotations);

    g.selectAll(".dot")
        .data(data.filter(function(d) { return d; }))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", line.x())
        .attr("cy", line.y())
        .attr("stroke", "steelblue")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 9)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
       
     console.log("About to define the makeAnnotations function");

    

//start debugging
   data.forEach(function(d) {
      console.log("Year:" + d.Year +  " x coordinate: " + x(d.Year) +" Incidents: " + d.Incidents + " y coordinate: " + y(d.Incidents));
    });
//end debugging

    svg.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);
 
      console.log("Made it past calling the makeAnnotations function");
  });

}


  renderTotalHateCrimeIncidents("#totalincidents-svg");


