// makeBarChart.js
//
// Amerens Jongsma (10735666)
// Dataprocessing Minor Programmeren
//
// script to create the variable Bar Chart

function makeBarChart(current_country_data, scores) {

  // removing/closing previous svg bar chart in case another country is clicked
  d4.select('#container3').select("#barchart").remove();

  // setting constants and initializing global variables for the svg chart
  const margin = {top: 50, bottom: 80, right: 50, left: 50}
  const svg_height = 400
  const svg_width = 400
  axis_width = svg_width - margin.left - margin.right
  axis_height = svg_height - margin.top - margin.bottom
  const barPadding = 1
  var title = current_country_data.country;

  // labels for x and y axis
  const xLabel = "variable"
  const yLabel = "%"

  // initializing the svg container for the right barchart
  var svg = body.select("#container3")
        .append("svg")
        .attr("id", "barchart")
        .attr("width", svg_width)
        .attr("height", svg_height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // adding a title to the bar chart, according to currently selected country
  svg.append("text")
    .attr("class", "plot")
    .attr("x", margin.left / 4)
    .attr("y", - margin.top / 4)
    .attr("fill", "#525252")
    .text("Better Life details about " + title );

  // set the ranges and correct scaling of x and y axis
  var x_scaling = d3.scale.linear()
    .domain([0, 5])
    .range([0, axis_width])

  var y_scaling = d3.scale.linear()
    .domain([0, 100])
    .range([axis_height, 0])

  var x_axis_labels = ['Feeling Safe', 'Employment Rate', 'Education', 'Water Quality', 'Voter Turnout']

  // define the x and y axis and scale accordingly
  var xAxis = d3.svg.axis()
      .scale(x_scaling)
      .orient("bottom")
      .ticks(5)
      .tickFormat(function(d, i){
        return x_axis_labels[i]
      })

  var yAxis = d3.svg.axis()
      .scale(y_scaling)
      .orient("left")
      .ticks(10)

  // adding the x axis to the svg block on the correct position
  var svg_x_axis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + axis_height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end" )
    .attr("dx", "0.8em")
    .attr("dy", "1.70em")
    .attr("transform", "rotate(-45)")

  // adding text labels to x axis
  svg.append("text")
    .attr("class", "axis")
    .attr("x", axis_width + margin.right)
    .attr("y", axis_height + 5)
    .attr("text-anchor", "end")
    .attr("text-alignment", "hanging")
    .text(xLabel);

  // adding the y axis to the svg block
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  svg.append("text")
    .attr("class", "axis")
    .attr("x", margin.left - 30)
    .attr("y", 0)
    .attr("dy", "1em")
    .attr("text-anchor", "end")
    .text(yLabel);

  // using d3-tip to add tooltips to a d3 bar chart
  // inspired by http://bl.ocks.org/Caged/6476579
  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-20, 0])
    .html(function(d, i) {
      return "<strong>" + x_axis_labels[i] + "</strong> <span style='color:white' >" + scores[i] + "% </span>";
      })
  svg.call(tip)


  // defining light and dark colors
  var lightestColor = '#fed976'
  var darkestColor = '#b10026'

  // determine color scale for bars
  var colorDimensions = d4.scaleLinear()
    .domain([d4.min(scores), d4.max(scores)])
    .interpolate(d4.interpolateHcl)
    .range([d4.rgb(darkestColor), d4.rgb(lightestColor)]);

  // connecting the data to rect elements in svg
  svg.selectAll("rect")
    .data(scores)
    .enter()
    .append("rect")
    .attr("class", "rect")
    .attr('width', 0)
    .attr('height', 0)
    .attr('y', axis_height)
    .attr("fill", function(d) {
          return colorDimensions(d)
        })
    .transition() // showing a transition from empty chart to bars showing up
    .duration(1500)
    .attr("x", function(d, i) {
        return  i * ((axis_width - barPadding) / scores.length)
    })
    .attr("width", axis_width / scores.length - barPadding)  // defining width of each bar
    .attr("y", function(d) {
      return y_scaling(d)  // data value used as y value
    })
    .attr("height", function(d) {
      return axis_height - y_scaling(d)  // height of axis minus data value
    })

  // showing and hiding tooltip bars
  svg.selectAll("rect")
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
}
