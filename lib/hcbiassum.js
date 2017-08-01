// Start Global Variables Definition
var WIDTH = 960, HEIGHT = 550; 
// End Global Variables Definition

function renderHateBiasMotivations(svgId) {
 
  var radius = 9;
	
	var margin = {top: 40, right: 20, bottom: 50, left: 70},
      width = WIDTH  - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

    //console.log("renderTotalHateCrimeIncidents function called with " + svgId + "with canvas width: " + width + " and convas height: " + height + " top margin: " + margin.top + " bottom margin: " + margin.bottom + " left margin: " + margin.left + " right margin: " + margin.right);

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
	var y = d3.scaleLog().range([height, 0]);
  

	var line_race_bias = d3.line()
      .defined(function(d) { return d; })
    	.x(function(d) { return x(d.Year); })
    	.y(function(d) { return y(d.Incidents); });

  var line_religion_bias = d3.line()
      .defined(function(d) { return d; })
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Incidents); });

  var line_sexual_orientation_bias = d3.line()
      .defined (function(d) { return d; })
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Incidents); });

	var g = svg.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json("data/table1_sum_flat.json", function(error, data) {
    	if (error) throw error;

    data.forEach(function(d) {
      d.Year = +d.Year;
      d.Incidents = +d.Incidents;
    });

  var race_bias = data.filter(function (d) {return d.Bias_Motivation_Category == "Race-Ethnicity-Ancestry"});
  var religion_bias = data.filter(function (d) {return d.Bias_Motivation_Category == "Religion"});
  var sexual_orientation__bias = data.filter(function (d) {return d.Bias_Motivation_Category == "Sexual Orientation"});
  

    //add this after data has been read
  var annotations = [{
    note: {
      align: "right",
      label: "Obama elected President",
      title: "2008"
    },
    x: 290 + margin.left, y: 50 + margin.bottom * 0.25,
    dy: -5,
    dx: 0,
    subject: { text: 'A', y:"bottom" },
    id: "minimize-badge"
  },{
    note: {
      align: "left",
      label: "Obama re-elected President",
      title: "2012"
    },
    x: 580 + margin.left, y: 135 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'B', y:"bottom" },
    id: "minimize-badge"
  }, {
      note: {
        align: "left",
        label: "The start of a divisive presidential campaign",
        title: "2015"
    },
    x: 798 + margin.left, y: 145 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'C', y:"bottom" },
    id: "minimize-badge"
  },{
      note: {
        align: "right",
        label: "San Bernardino, CA, mass shooting.",
        title: "2015"
    },
    x: 798 + margin.left, y: 400 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'D', y:"bottom" },
    id: "minimize-badge"
  }];
 
    console.log("Made it past instantiating the annotations object");
       
    x.domain([2004, 2016]);
    //y.domain([d3.min(data, function(d) { return d.Incidents; }) - 500, d3.max(data, function(d) { return d.Incidents; }) + 500]);
    y.domain([950, d3.max(data, function(d) { return d.Incidents; })+ 500]);

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
    
    //create line path for race bias motivation

    g.append("path")
        .data([race_bias])
        .attr("class", "line-race")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line_race_bias);

    //add annotations
    var makeAnnotations = d3.annotation()
      .editMode(false)
      .type(type)
      .annotations(annotations);

    //create circles for race bias motivation tooltips

    g.selectAll(".dot")
        .data(race_bias.filter(function(d) { return d; }))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", line_race_bias.x())
        .attr("cy", line_race_bias.y())
        .attr("stroke", "steelblue")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 6)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    //create line path for religion bias

    g.append("path")
        .data([religion_bias])
        .attr("class", "line-religion")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line_religion_bias);

     //create circles for religion bias motivation tooltips

     g.selectAll(".dot_rel")
        .data(religion_bias.filter(function(d) { 
            return d; }))
        .enter().append("circle")
        .attr("class", "dot_rel")
        .attr("cx", line_religion_bias.x())
        .attr("cy", line_religion_bias.y())
        .attr("stroke", "#C43E3E")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 6)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    //create line path for sexual orientation bias

    g.append("path")
            .data([sexual_orientation__bias])
            .attr("class", "line-sex")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line_sexual_orientation_bias);


      g.selectAll(".dot_sex")
        .data(sexual_orientation__bias.filter(function(d) { 
            return d; }))
        .enter().append("circle")
        .attr("class", "dot_sex")
        .attr("cx", line_sexual_orientation_bias.x())
        .attr("cy", line_sexual_orientation_bias.y())
        .attr("stroke", "#208726")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 6)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

  
     console.log("About to define the makeAnnotations function");

    

//start debugging
   religion_bias.forEach(function(d) {
      console.log("Year:" + d.Year +  " x coordinate: " + x(d.Year) +" Incidents: " + d.Incidents + " y coordinate: " + y(d.Incidents));

    });
//end debugging

    svg.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);
 
      console.log("Made it past calling the makeAnnotations function");
  });
  
  //create legend
  var legend_scale = d3.scaleOrdinal()
      .domain(["Race Bias", "Religion Bias", "Sexual Orientation Bias"])
      .range(["rgb(70,130,180)", "rgb(196,62,62)", "rgb(32,135,38)"]);

  svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate( 140, 200 )");

    var legendOrdinal = d3.legendColor()
       .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
       .shapePadding(10)
       .scale(legend_scale);

    svg.select(".legendOrdinal")
        .call(legendOrdinal);

  
}


  renderHateBiasMotivations("#hcbiassum-svg");


