<!-- Start Global Variables Definition -->
var WIDTH = 960, HEIGHT = 600; //originally 1600
<!-- End Global Variables Definition -->

function renderTotalHateCrimeIncidents(svgId) {

	var width = WIDTH, height = HEIGHT;
	var margin = {top: 20, right: 20, bottom: 30, left: 40};

    console.log("renderTotalHateCrimeIncidents function called with " + svgId + "with canvas width: " + width + " and convas height: " + height + " top margin: " + margin.top + " bottom margin: " + margin.bottom + " left margin: " + margin.left + " right margin: " + margin.right);

     var svg = d3.select(svgId).append("svg")
                         .attr("width", width - margin.left - margin.right)
                         .attr("height", height - margin.top - margin.bottom);

     console.log("svg: " + svg + " svg width: " + svg.style("width") + " svg height: " + svg.style("height"));                   


}


  renderTotalHateCrimeIncidents("#totalincidents-svg");


