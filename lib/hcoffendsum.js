// Start Global Variables Definition
var WIDTH = 960, HEIGHT = 500; 

// End Global Variables Definition


function renderRaceBiasMotivationsBarFirstTime(svgId, race_bias_motivation_subcategory, barchartColor, titlePrefix, bartCharId, titleId){
  console.log("renderRaceBiasMotivationBar function invoked with a Bias Motivation Category of " + race_bias_motivation_subcategory + " and barchart color: " + barchartColor + " and title prefix: " + titlePrefix);


  var margin = {top: 40, right: 20, bottom: 50, left: 70},
      width = WIDTH  - margin.left - margin.right,
      height = HEIGHT - margin.top - margin.bottom;

  var colorBar = d3.scaleOrdinal(d3.schemeCategory20);
  var barPadding = 1;

    //console.log("renderTotalHateCrimeIncidents function called with " + svgId + "with canvas width: " + width + " and convas height: " + height + " top margin: " + margin.top + " bottom margin: " + margin.bottom + " left margin: " + margin.left + " right margin: " + margin.right);


 //set up annotations

   var annotations = [{
    note: {
      align: "right",
      label: "Blacks and African Americans make up 13.6 % of the U.S. Population.",
      title: "Blacks and African Americans"
    },
    x: 100 + margin.left, y: 250 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'A', y:"bottom" },
    id: "minimize-badge"
  },{
    note: {
      align: "left",
      label: "Hispanics make up 16.3 % of the U.S. Population.",
      title: "Hispanics"
    },
    x: 150 + margin.left, y: 300 + margin.bottom * 0.25,
    dy: -15,
    dx: 0,
    subject: { text: 'B', y:"bottom" },
    id: "minimize-badge"
  },
  {
    note: {
      align: "right",
      label: "Whites make up 72.4 % of the U.S. Population.",
      title: "Whites"
    },
    x: 748 + margin.left, y: 225 + margin.bottom * 0.25,
    dy: -15,
    dx: -5,
    subject: { text: 'C', y:"bottom" },
    id: "minimize-badge"
  }
  ];

  var type = d3.annotationCalloutElbow;

 //add annotations
  var makeAnnotations = d3.annotation()
      .editMode(false)
      .type(type)
      .annotations(annotations);

 //end of annotation setup






//add variable and properties for tooltip 
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "Race or Ethnicity of Offender: " + d.Race_Ethnicity_Of_Offender_Desc + "<br> Percent of Offenses: "  + d.Percent_Of_Offenses  + " %";
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
  d3.json("data/table5_2013_2015_summ_pivot.json", function(error, data){
      if (error) throw error;

    data.forEach(function(d) {
      d.Offenses = +d.Offenses;
      d.Percent_Of_Offenses = +d.Percent_Of_Offenses;
      console.log("bias motivation subcategory: " + d.Bias_Motivation_SubCategory + "Race or Ethnicity of Offender: " + d.Race_Ethnicity_Of_Offender + " Number of Offenses: " + d.Offenses + " Percent of Offenses " + d.Percent_Of_Offenses);
    });

     //filter data by bias motiviation subcategory
    //var barchart_data = data.filter(function (d) {return d.Bias_Motivation_SubCategory == race_bias_motivation_subcategory});  
    //console.log(JSON.stringify(barchart_data));

    //create the x and y scales

    var   xScale = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, width])
            ;
            
  // Create linear y scale 
  // Purpose: No matter what the data is, the bar should fit into the svg area; bars should not
  // get higher than the svg height. Hence incoming data needs to be scaled to fit into the svg area.  
  var yScale = d3.scaleLinear()
      // use the max funtion to derive end point of the domain (max value of the dataset)
      // do not use the min value of the dataset as min of the domain as otherwise you will not see the first bar
       .domain([0, d3.max(data, function(d) { return d.Offenses; })])
       // As coordinates are always defined from the top left corner, the y position of the bar
       // is the svg height minus the data value. So you basically draw the bar starting from the top. 
       // To have the y position calculated by the range function
       .range([height, 0])
       ;

   //start appending the rectangles for the bar chart
   g.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
          return xScale(i);
      })
       .attr("width", width / data.length - barPadding)   
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
    .data(data)
    .enter()
    .append("text")
    .text(function(d) {
      return d.Percent_Of_Offenses  + " %";})
    .attr("text-anchor", "middle")
  // Set x position to the left edge of each bar plus half the bar width
    .attr("x", function(d, i) {
      return (i * (width / data.length)) + ((width / data.length - barPadding) / 2);
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
      .data(data)
      .enter()
      .append("text")
      .text(function(d) { return d.Race_Ethnicity_Of_Offender;})
      .attr("text-anchor", "middle")
      //.attr("transform", "rotate(90)")
      // Set x position to the left edge of each bar plus half the bar width
      .attr("x", function(d, i) {
                  return (i * (width / data.length)) + ((width / data.length - barPadding) / 2);
      })

      .attr("y", 15)
      .attr("class", "xAxis")
      ;   




  // Title
  
  var titleText = function(d){
      return "Percentage of Hate Crime Offenses (2012 - 2015) By Offenders";
  };



  svg.append("text")
    .attr("x", (width + margin.left + margin.right)/2 + 75)
    .attr("y", 10)
    .attr("class","title")        
    .attr("text-anchor", "middle")
    .text(titleText)
    .attr("id", titleId);
    ;


  });
  
  //render annotations
  
   svg.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);
 


  //renderRaceBiasMotivationsLine(svgId);
}


 
  renderRaceBiasMotivationsBarFirstTime("#racebiasbar-svg", "Race-Ethnicity-Ancestry","lightgrey", "ALL","barChartPlot-race","title-race");


