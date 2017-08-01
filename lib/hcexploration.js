// Start Global Variables Definition
var WIDTH = 480, HEIGHT = 300; 

// End Global Variables Definition

function renderRaceBiasMotivationsLine(svgId) {
 	
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
  

	var line_antiblack_bias = d3.line()
      .defined(function(d) { return d; })
    	.x(function(d) { return x(d.Year); })
    	.y(function(d) { return y(d.Incidents); });

  var line_antiwhite_bias = d3.line()
      .defined(function(d) { return d; })
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Incidents); });

  var line_antihispanic_bias = d3.line()
      .defined (function(d) { return d; })
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Incidents); });

	var g = svg.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.json("data/table1_race_detail_flat.json", function(error, data) {
    	if (error) throw error;

    data.forEach(function(d) {
      d.Year = +d.Year;
      d.Incidents = +d.Incidents;
    });

  var antiblack_bias = data.filter(function (d) {return d.Bias_Motivation_SubCategory == "Anti-Black"});
  var antiwhite_bias = data.filter(function (d) {return d.Bias_Motivation_SubCategory == "Anti-White"});
  var antihispanic_bias = data.filter(function (d) {return d.Bias_Motivation_SubCategory == "Anti-Hispanic"});
  
/*
    //add this after data has been read
  var annotations = [{
    note: {
      align: "right",
      label: "Obama elected President",
      title: "2008"
    },
    x: 290 + margin.left, y: 27 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'A', y:"bottom" },
    id: "minimize-badge"
  },{
    note: {
      align: "left",
      label: "Obama re-elected President",
      title: "2012"
    },
    x: 580 + margin.left, y: 107 + margin.bottom * 0.25,
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
    x: 798 + margin.left, y: 118 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'C', y:"bottom" },
    id: "minimize-badge"
  },{
      note: {
        align: "right",
        label: "San Bernadino, CA, mass shooting.",
        title: "2015"
    },
    x: 798 + margin.left, y: 347 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'D', y:"bottom" },
    id: "minimize-badge"
  }];
 
    console.log("Made it past instantiating the annotations object");
  */     
    x.domain([2004, 2016]);
    //y.domain([d3.min(data, function(d) { return d.Incidents; }) - 500, d3.max(data, function(d) { return d.Incidents; }) + 500]);
    y.domain([50, d3.max(data, function(d) { return d.Incidents; })+ 100]);

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
    
    //create line path for anti-black bias motivation

    g.append("path")
        .data([antiblack_bias])
        .attr("class", "line-race")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line_antiblack_bias)
        .on("click", onclick_antiblackbias);

/*
    //add annotations
    var makeAnnotations = d3.annotation()
      .editMode(false)
      .type(type)
      .annotations(annotations);
*/
    //create circles for anti-black bias motivation tooltips

    g.selectAll(".dot")
        .data(antiblack_bias.filter(function(d) { return d; }))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", line_antiblack_bias.x())
        .attr("cy", line_antiblack_bias.y())
        .attr("stroke", "steelblue")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 6)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on("click", onclick_antiblackbias);

     function onclick_antiblackbias(d,i){
          var barchartColor = "steelblue";
          var titlePrefix = "Anti-Black Bias";
          var barchartId = "barChartPlot-race";
          var titleTextId ="title-race";
          var bias_subcategory = (typeof d.Bias_Motivation_SubCategory == 'undefined' ? "Anti-Black" : d.Bias_Motivation_SubCategory);
          console.log("onclick event triggered for Dominant Hate Biases Line Chart. Bias Motivation Subcategory: " + bias_subcategory + " bar chart color: " + barchartColor + " title prefix; " + titlePrefix);
          updateRaceBiasMotivationsBar("#racebiasbar-svg", bias_subcategory, barchartColor, titlePrefix, barchartId, titleTextId);
     }

    //create line path for anti-white bias

    g.append("path")
        .data([antiwhite_bias])
        .attr("class", "line-religion")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line_antiwhite_bias)
        .on("click", onclick_antiwhitebias);

     //create circles for anti-white bias motivation tooltips

     g.selectAll(".dot_rel")
        .data(antiwhite_bias.filter(function(d) { 
            return d; }))
        .enter().append("circle")
        .attr("class", "dot_rel")
        .attr("cx", line_antiwhite_bias.x())
        .attr("cy", line_antiwhite_bias.y())
        .attr("stroke", "#C43E3E")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 6)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on("click", onclick_antiwhitebias);



        function onclick_antiwhitebias(d,i){

          var barchartColor = "#C43E3E";
          var titlePrefix = "Anti-White Bias";
          var barchartId = "barChartPlot-race";
          var titleTextId ="title-race";
          var bias_subcategory = (typeof d.Bias_Motivation_SubCategory == 'undefined' ? "Anti-White" : d.Bias_Motivation_SubCategory);
          console.log("onclick event triggered for Dominant Hate Biases Line Chart. Bias Motivation Subcategory: " + bias_subcategory + " bar chart color: " + barchartColor + " title prefix: " + titlePrefix);
          updateRaceBiasMotivationsBar("#racebiasbar-svg", bias_subcategory, barchartColor, titlePrefix, barchartId, titleTextId);
        }

    //create line path for sexual orientation bias

    g.append("path")
            .data([antihispanic_bias])
            .attr("class", "line-sex")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line_antihispanic_bias)
            .on("click", onclick_antihispanicbias);


      g.selectAll(".dot_sex")
        .data(antihispanic_bias.filter(function(d) { 
            return d; }))
        .enter().append("circle")
        .attr("class", "dot_sex")
        .attr("cx", line_antihispanic_bias.x())
        .attr("cy", line_antihispanic_bias.y())
        .attr("stroke", "#208726")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 6)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
         .on("click", onclick_antihispanicbias);

        function onclick_antihispanicbias(d,i){
          var barchartColor = "#208726";
          var titlePrefix = "Anti-Hispanic";
          var barchartId = "barChartPlot-race";
          var titleTextId ="title-race";
          var bias_subcategory = (typeof d.Bias_Motivation_SubCategory == 'undefined' ? "Anti-Hispanic" : d.Bias_Motivation_SubCategory);
          console.log("onclick event triggered for Dominant Hate Biases Line Chart. Bias Motivation Subcategory: " + bias_subcategory + " bar chart color: " + barchartColor + " title prefix: " + titlePrefix);
          updateRaceBiasMotivationsBar("#racebiasbar-svg", bias_subcategory, barchartColor, titlePrefix, barchartId, titleTextId);
        }

  
     //console.log("About to define the makeAnnotations function");

    

//start debugging
   antiblack_bias.forEach(function(d) {
      console.log("Year:" + d.Year +  " x coordinate: " + x(d.Year) +" Incidents: " + d.Incidents + " y coordinate: " + y(d.Incidents));

    });
//end debugging

/*

    svg.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);
 */
      //console.log("Made it past calling the makeAnnotations function");
  });
  
  //create legend
  var legend_scale = d3.scaleOrdinal()
      .domain(["Anti-Black Bias", "Anti-White Bias", "Anti-Hispanic Bias"])
      .range(["rgb(70,130,180)", "rgb(196,62,62)", "rgb(32,135,38)"]);

  svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate( 140, 175 )");

    var legendOrdinal = d3.legendColor()
       .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
       .shapePadding(10)
       .scale(legend_scale);

    svg.select(".legendOrdinal")
        .call(legendOrdinal);

  
}

function renderReligionBiasMotivationsLine(svgId) {
   //renderRaceBiasMotivationsLine(svgId);
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
  

  var line_antijewish_bias = d3.line()
      .defined(function(d) { return d; })
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Incidents); });

  var line_antiislamic_bias = d3.line()
      .defined(function(d) { return d; })
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Incidents); });

  var line_antiother_bias = d3.line()
      .defined (function(d) { return d; })
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.Incidents); });

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("data/table1_religion_detail_flat.json", function(error, data) {
      if (error) throw error;

    data.forEach(function(d) {
      d.Year = +d.Year;
      d.Incidents = +d.Incidents;
    });

  var antijewish_bias = data.filter(function (d) {return d.Bias_Motivation_SubCategory == "Anti-Jewish"});
  var antiislamic_bias = data.filter(function (d) {return d.Bias_Motivation_SubCategory == "Anti-Islamic"});
  var antiother_bias = data.filter(function (d) {return d.Bias_Motivation_SubCategory == "Anti-Other Religion"});
  
/*
    //add this after data has been read
  var annotations = [{
    note: {
      align: "right",
      label: "Obama elected President",
      title: "2008"
    },
    x: 290 + margin.left, y: 27 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'A', y:"bottom" },
    id: "minimize-badge"
  },{
    note: {
      align: "left",
      label: "Obama re-elected President",
      title: "2012"
    },
    x: 580 + margin.left, y: 107 + margin.bottom * 0.25,
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
    x: 798 + margin.left, y: 118 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'C', y:"bottom" },
    id: "minimize-badge"
  },{
      note: {
        align: "right",
        label: "San Bernadino, CA, mass shooting.",
        title: "2015"
    },
    x: 798 + margin.left, y: 347 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'D', y:"bottom" },
    id: "minimize-badge"
  }];
 
    console.log("Made it past instantiating the annotations object");
  */     
    x.domain([2004, 2016]);
    //y.domain([d3.min(data, function(d) { return d.Incidents; }) - 500, d3.max(data, function(d) { return d.Incidents; }) + 500]);
    y.domain([50, d3.max(data, function(d) { return d.Incidents; })+ 100]);

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
    
    //create line path for anti-jewish bias motivation

    g.append("path")
        .data([antijewish_bias])
        .attr("class", "line-race")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line_antijewish_bias)
        .on("click", onclick_antijewish);

/*
    //add annotations
    var makeAnnotations = d3.annotation()
      .editMode(false)
      .type(type)
      .annotations(annotations);
*/
    //create circles for anti-jewish bias motivation tooltips

    g.selectAll(".dot")
        .data(antijewish_bias.filter(function(d) { return d; }))
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", line_antijewish_bias.x())
        .attr("cy", line_antijewish_bias.y())
        .attr("stroke", "steelblue")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 6)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on("click", onclick_antijewish);

    function onclick_antijewish(d,i){
          var barchartColor = "steelblue";
          var titlePrefix = "Anti-Jewish Bias";
          var barchartId = "barChartPlot-religion";
          var titleTextId ="title-religion";
          var bias_subcategory = (typeof d.Bias_Motivation_SubCategory == 'undefined' ? "Anti-Jewish" : d.Bias_Motivation_SubCategory);
          console.log("onclick event triggered for Dominant Hate Biases Line Chart. Bias Motivation Subcategory: " + bias_subcategory + " bar chart color: " + barchartColor + " title prefix: " + titlePrefix);
          updateRaceBiasMotivationsBar("#religionbiasbar-svg", bias_subcategory, barchartColor, titlePrefix, barchartId, titleTextId);
     }

    //create line path for anti-islamic bias

    g.append("path")
        .data([antiislamic_bias])
        .attr("class", "line-religion")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line_antiislamic_bias)
        .on("click", onclick_antiislamic);

     //create circles for anti-islamic bias motivation tooltips

     g.selectAll(".dot_rel")
        .data(antiislamic_bias.filter(function(d) { 
            return d; }))
        .enter().append("circle")
        .attr("class", "dot_rel")
        .attr("cx", line_antiislamic_bias.x())
        .attr("cy", line_antiislamic_bias.y())
        .attr("stroke", "#C43E3E")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 6)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on("click", onclick_antiislamic);

        function onclick_antiislamic(d,i){
          var barchartColor = "#C43E3E";
          var titlePrefix = "Anti-Islamic Bias";
          var barchartId = "barChartPlot-religion";
          var titleTextId ="title-religion";
          var bias_subcategory = (typeof d.Bias_Motivation_SubCategory == 'undefined' ? "Anti-Islamic" : d.Bias_Motivation_SubCategory);
          console.log("onclick event triggered for Dominant Hate Biases Line Chart. Bias Motivation Subcategory: " + bias_subcategory + " bar chart color: " + barchartColor + " title prefix: " + titlePrefix);
          updateRaceBiasMotivationsBar("#religionbiasbar-svg", bias_subcategory, barchartColor, titlePrefix, barchartId, titleTextId);
        }

    //create line path for anti-other religion bias orientation bias

    g.append("path")
            .data([antiother_bias])
            .attr("class", "line-sex")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line_antiother_bias)
            .on("click", onclick_antiotherreligionbias);


      g.selectAll(".dot_sex")
        .data(antiother_bias.filter(function(d) { 
            return d; }))
        .enter().append("circle")
        .attr("class", "dot_sex")
        .attr("cx", line_antiother_bias.x())
        .attr("cy", line_antiother_bias.y())
        .attr("stroke", "#208726")
        .attr("fill", "white")
        .attr("stroke-width","3.0px")
        .attr("r", 6)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on("click", onclick_antiotherreligionbias);

        function onclick_antiotherreligionbias(d,i){
          var barchartColor = "#208726";
          var titlePrefix = "Anti-Other Religion Bias";
          var titlePrefix = "Anti-Islamic Bias";
          var barchartId = "barChartPlot-religion";
          var titleTextId ="title-religion";
          var bias_subcategory = (typeof d.Bias_Motivation_SubCategory == 'undefined' ? "Anti-Other Religion" : d.Bias_Motivation_SubCategory);
          console.log("onclick event triggered for Dominant Hate Biases Line Chart. Bias Motivation Subcategory: " + bias_subcategory + " bar chart color: " + barchartColor, " title prefix: " + titlePrefix);
          updateRaceBiasMotivationsBar("#religionbiasbar-svg", bias_subcategory, barchartColor, titlePrefix, barchartId, titleTextId);
        }

  
     //console.log("About to define the makeAnnotations function");

    

//start debugging
   antijewish_bias.forEach(function(d) {
      console.log("Year:" + d.Year +  " x coordinate: " + x(d.Year) +" Incidents: " + d.Incidents + " y coordinate: " + y(d.Incidents));

    });
//end debugging

/*

    svg.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);
 */
      //console.log("Made it past calling the makeAnnotations function");
  });
  
  //create legend
  var legend_scale = d3.scaleOrdinal()
      .domain(["Anti-Jewish Bias", "Anti-Islamic Bias", "Anti-Other Religion Bias"])
      .range(["rgb(70,130,180)", "rgb(196,62,62)", "rgb(32,135,38)"]);

  svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate( 140, 85 )");

    var legendOrdinal = d3.legendColor()
       .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
       .shapePadding(10)
       .scale(legend_scale);

    svg.select(".legendOrdinal")
        .call(legendOrdinal);

  
  


}

function renderRaceBiasMotivationsBarFirstTime(svgId, race_bias_motivation_subcategory, barchartColor, titlePrefix, bartCharId, titleId){
  console.log("renderRaceBiasMotivationBar function invoked with a Bias Motivation Category of " + race_bias_motivation_subcategory + " and barchart color: " + barchartColor + " and title prefix: " + titlePrefix);


  var margin = {top: 40, right: 20, bottom: 50, left: 70},
      width = WIDTH  - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

  var colorBar = d3.scaleOrdinal(d3.schemeCategory20);
  var barPadding = 1;

    //console.log("renderTotalHateCrimeIncidents function called with " + svgId + "with canvas width: " + width + " and convas height: " + height + " top margin: " + margin.top + " bottom margin: " + margin.bottom + " left margin: " + margin.left + " right margin: " + margin.right);

//add variable and properties for tooltip 
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "Race or Ethnicity of Offender: " + d.Race_Ethnicity_Of_Offender + "<br> Percent of Offenses: "  + d.Percent_Of_Offenses + " %";
    });

  var svg = d3.select(svgId).append("svg")
                         .attr("width", width + margin.left + margin.right)
                         .attr("height", height + margin.top + margin.bottom)
                         .attr("id", bartCharId);

  
  console.log("svg: " + svg + " svg width: " + svg.style("width") + " svg height: " + svg.style("height"));     

  //set the drawing position at the top left margin of the SVG
  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");              

//add tooltip to svg

  svg.call(tip);
  var barchart_data = {};
  //retrieve the data
  d3.json("data/table5_2013_2015_rce_rel_detail_pivot.json", function(error, data){
      if (error) throw error;

    data.forEach(function(d) {
      d.Offenses = +d.Offenses;
      d.Percent_Of_Offenses = +d.Percent_Of_Offenses;
      //console.log("bias motivation subcategory: " + d.Bias_Motivation_SubCategory + "Race or Ethnicity of Offender: " + d.Race_Ethnicity_Of_Offender + " Number of Offenses: " + d.Offenses + " Percent of Offenses " + d.Percent_Of_Offenses);
    });

     //filter data by bias motiviation subcategory
    var barchart_data = data.filter(function (d) {return d.Bias_Motivation_SubCategory == race_bias_motivation_subcategory});  
    console.log(JSON.stringify(barchart_data));

    //create the x and y scales

    var   xScale = d3.scaleLinear()
            .domain([0, barchart_data.length])
            .range([0, width])
            ;
            
  // Create linear y scale 
  // Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
  // get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.  
  var yScale = d3.scaleLinear()
      // use the max funtion to derive end point of the domain (max value of the dataset)
      // do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
       .domain([0, d3.max(barchart_data, function(d) { return d.Offenses; })])
       // As coordinates are always defined from the top left corner, the y position of the bar
       // is the svg height minus the data value. So you basically draw the bar starting from the top. 
       // To have the y position calculated by the range function
       .range([height, 0])
       ;

   //start appending the rectangles for the bar chart
   g.selectAll("rect")
       .data(barchart_data)
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
          return xScale(i);
      })
       .attr("width", width / barchart_data.length - barPadding)   
      .attr("y", function(d) {
          return yScale(d.Offenses);
      })  
      .attr("height", function(d) {
          return height-yScale(d.Offenses);
      })
      .attr("fill", barchartColor)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      ;



    // Add y labels to plot 
  
  g.selectAll("text")
    .data(barchart_data)
    .enter()
    .append("text")
    .text(function(d) {
      return d.Percent_Of_Offenses  + " %";})
    .attr("text-anchor", "middle")
  // Set x position to the left edge of each bar plus half the bar width
    .attr("x", function(d, i) {
      return (i * (width / barchart_data.length)) + ((width / barchart_data.length - barPadding) / 2);
    })
    .attr("y", function(d) {
      return yScale(d.Offenses);
    })
    .attr("class", "yAxis")

  
    // Add x labels to chart  
  
  var xLabels = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + height)  + ")")
        ;

  xLabels.selectAll("text.xAxis")
      .data(barchart_data)
      .enter()
      .append("text")
      .text(function(d) { return d.Race_Ethnicity_Of_Offender;})
      .attr("text-anchor", "middle")
      //.attr("transform", "rotate(90)")
      // Set x position to the left edge of each bar plus half the bar width
      .attr("x", function(d, i) {
                  return (i * (width / barchart_data.length)) + ((width / barchart_data.length - barPadding) / 2);
      })

      .attr("y", 15)
      .attr("class", "xAxis")
      ;   




  // Title
  
  var titleText = function(d){
      return titlePrefix + " Hate Crimes (2012 - 2015)";
  };



  svg.append("text")
    .attr("x", (width + margin.left + margin.right)/2 + 30)
    .attr("y", 10)
    .attr("class","title")        
    .attr("text-anchor", "middle")
    .text(titleText)
    .attr("id", titleId);
    ;


  });
  
  
 
 


  //renderRaceBiasMotivationsLine(svgId);
}

function updateRaceBiasMotivationsBar(svgId, race_bias_motivation_subcategory, barchartColor, titlePrefix, bartCharId, titleId) {
   console.log("updateRaceBiasMotivationsBar function invoked with a Bias Motivation Category of " + race_bias_motivation_subcategory + " and barchart color: " + barchartColor + " and titlePrefix: " + titlePrefix);
   
   var margin = {top: 40, right: 20, bottom: 50, left: 70},
      width = WIDTH  - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

  var colorBar = d3.scaleOrdinal(d3.schemeCategory20);
  var barPadding = 1;

  //add variable and properties for tooltip 
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "Race or Ethnicity of Offender: " + d.Race_Ethnicity_Of_Offender + "<br> Percent of Offenses: "  + d.Percent_Of_Offenses + " %";
    });

  var barchart_data = {};
  //retrieve the data
  d3.json("data/table5_2013_2015_rce_rel_detail_pivot.json", function(error, data){
      if (error) throw error;

    data.forEach(function(d) {
      d.Offenses = +d.Offenses;
      d.Percent_Of_Offenses = +d.Percent_Of_Offenses;
      //console.log("bias motivation subcategory: " + d.Bias_Motivation_SubCategory + "Race or Ethnicity of Offender: " + d.Race_Ethnicity_Of_Offender + " Number of Offenses: " + d.Offenses + " Percent of Offenses " + d.Percent_Of_Offenses);
    });

     //filter data by bias motiviation subcategory
    var barchart_data = data.filter(function (d) {return d.Bias_Motivation_SubCategory == race_bias_motivation_subcategory});  
    console.log(JSON.stringify(barchart_data));

    //create the x and y scales

    var   xScale = d3.scaleLinear()
            .domain([0, barchart_data.length])
            .range([0, width])
            ;
            
  // Create linear y scale 
  // Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
  // get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.  
    var yScale = d3.scaleLinear()
      // use the max funtion to derive end point of the domain (max value of the dataset)
      // do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
       .domain([0, d3.max(barchart_data, function(d) { return d.Offenses; })])
       // As coordinates are always defined from the top left corner, the y position of the bar
       // is the svg height minus the data value. So you basically draw the bar starting from the top. 
       // To have the y position calculated by the range function
       .range([height, 0])
       ;

  //retrieve existing svg
    var svg = d3.select(svgId + " svg");
    
    var plot = d3.select("#"+bartCharId)
      .datum(barchart_data);
  
  //refresh the chart

  plot.selectAll("rect")
        .data(barchart_data)
        .transition()
        .duration(750)
        .attr("x", function(d, i) {
          return xScale(i);
        })
        .attr("width", width / barchart_data.length - barPadding)   
        .attr("y", function(d) {
          return yScale(d.Offenses);
        })   
        .attr("height", function(d) {
          return height-yScale(d.Offenses);
        })
        .attr("fill", barchartColor);

  plot.selectAll("text.yAxis") // target the text element(s) which has a yAxis class defined
      .data(barchart_data)
      .transition()
      .duration(750)
       .attr("text-anchor", "middle")
       .attr("x", function(d, i) {
          return (i * (width / barchart_data.length)) + ((width / barchart_data.length - barPadding) / 2);
        })
       .attr("y", function(d) {
          return yScale(d.Offenses);
       })
       .text(function(d) {
          return d.Percent_Of_Offenses  + " %";
       })
       .attr("class", "yAxis")           
    ;
    

    // Title
  
  var titleText = function(d){
      return titlePrefix + " Hate Crimes (2012 - 2015)";
  };

  

  svg.select("#"+titleId)
    .attr("x", (width + margin.left + margin.right)/2 + 30)
    .attr("y", 10)
    .attr("class","title")        
    .attr("text-anchor", "middle")
    .text(titleText)
    ;

  });

}


  renderRaceBiasMotivationsLine("#racebiasline-svg");
  renderReligionBiasMotivationsLine("#religionbiasline-svg");
  renderRaceBiasMotivationsBarFirstTime("#racebiasbar-svg", "Race-Ethnicity-Ancestry","lightgrey", "Race Based","barChartPlot-race","title-race");
  renderRaceBiasMotivationsBarFirstTime("#religionbiasbar-svg", "Religion", "lightgrey", "Religion Based", "barChartPlot-religion", "title-religion");


