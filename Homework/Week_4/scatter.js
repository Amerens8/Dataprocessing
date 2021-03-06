// scatter.js
//
// Amerens Jongsma (10735666)
// Dataprocessing Minor Programmeren
// script to make a scatter plot with API request

// defining regularly-used variables globally
var body = d3.select("body")
var head = d3.select("head")

// functions to run when window is initially loaded
window.onload = function() {
  addHeaders();

  // using 2015 as the initial dataset
  var selectedValue = '2015'
  updateData(selectedValue)
}

// creating a title for the index HTML page and add dropdown menu
function addHeaders() {
    head
      .append("title")
      .text("Week 4 Scatterplot Unemployment Foreign Versus Native born");

    // adding description to the web page
    body
      .style("background-color", "#e6f2ff");

    body
      .append("h1")
      .text("Scatterplot Unemployment Rates");

    body
      .append("h2")
      .text("Foreign Born versus Native Born");

    body
      .append("h3")
      .text("Amerens Jongsma | Minor Programmeren, Data Processing");

    body
      .append("h4")
      .text("This scatterplot shows the unemployment rate in countries of foreign born")
      .append("h4")
      .text("and native born people. In some countries it seems to be more likely to get")
      .append("h4")
      .text("employed, when you're actually born in that country (e.g. Sweden).")

    // make a dropdown menu
    var select = body.append('select')
      .attr('class','select')
      .on('change', onchange)

    var years = ['2015', '2016']
    var options = select
      .selectAll('option')
      .data(years)
      .attr('class','dropdown')
      .enter()
      .append('option')
      .text(function (d) { return d; });

    function onchange() {
      selectedValue = d3.select('select').property('value')
      updateData(selectedValue)
    }

    body
      .append("h1")
      .text(" ")
  }

// introduce, request and check for current dataset
function updateData(selectedValue){
  var data_unemploy15 = "https://stats.oecd.org/SDMX-JSON/data/MIG_NUP_RATES_GENDER/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+OECD.FB+NB.MEN+WMN+TOT.U_RATE+P_RATE/all?startTime=2015&endTime=2015&dimensionAtObservation=allDimensions"
  var data_unemploy16 = "https://stats.oecd.org/SDMX-JSON/data/MIG_NUP_RATES_GENDER/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+OECD.FB+NB.MEN+WMN+TOT.U_RATE+P_RATE/all?startTime=2016&endTime=2016&dimensionAtObservation=allDimensions"

  if ('2015' == selectedValue) {
    dataset = data_unemploy15
  }
  else if ('2016' == selectedValue) {
    dataset = data_unemploy16
  }

  // deleting all previously drawn circles and charts
  body
    .selectAll("circle")
    .remove()
  body
    .select("svg")
    .remove()
  body
    .select("p")
    .remove()

  d3.queue()
    .defer(d3.request, dataset)
    .awaitAll(collectData);
  }

// function to load data into dictionary
function collectData(error, response) {
  // emptying and/or initializing possible previously made arrays
  var foreign = []
  var native = []
  var countries = []
  var dictionary = []

  // check for error when loading data
  if (error) throw error;

  // storing json version of data
  data_json = JSON.parse(response[0].responseText)

  // extract and put data from dataset in arrays
  for (let i = 0; i < 31 ; i++){

    // storing countries in an array
    country_name = data_json.structure.dimensions.observation["0"].values[i].name
    if (country_name) {
      countries.push(country_name)
    }

    // storing foreign borns data in array
    var country = i + ":" + "0:2:0:0";
    var foreign_data = data_json.dataSets[0].observations[country][0]
    if (foreign_data) {
      foreign.push(foreign_data)
    }

    // storing native borns data in array
    var country = i + ":" + "1:2:0:0";
    var native_data = data_json.dataSets[0].observations[country][0]
    if (native_data) {
      native.push(native_data)
    }
  }

  // combining previous arrays in a dictionary
  for (let i = 0; i < countries.length; i++){
    dictionary.push({
        "country": countries[i],
        "native": native[i],
        "foreign": foreign[i],
    })
  }
  // make a SVG element with the input from the previously made dictionary
  makeSVG(dictionary)
}

// function to create CVG block
function makeSVG(dictionary) {
  // initializing lengths and widths and margins
  const margin = {top: 40, bottom: 40, right: 40, left: 60}
  const svg_height = 650
  const svg_width = 650
  axis_width = svg_width - margin.left - margin.right;
  axis_height = svg_height - margin.top - margin.bottom;

  // create SVG element
  var svg = body
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // domains started at 0 and end at same value on purpose, to have an equal x_scaling
  // and be able to clearly see where foreign and native Unemployment rates are equal
  var xdomain = [ 0,
                  d3.max(dictionary, function(d){
                  return d.foreign + 1})]

  var ydomain = [ 0,
                  d3.max(dictionary, function(d){
                  return d.foreign + 1})]

  // linear scaling for determining axis.
  var x_scaling = d3.scaleLinear()
    .domain(xdomain)
    .range([0, axis_width]);

  var y_scaling = d3.scaleLinear()
    .domain(ydomain)
    .range([axis_height, 0]);

  // native x axis
  var x_axis = d3.axisBottom(x_scaling)

  // foreign y axis
  var y_axis = d3.axisLeft(y_scaling)

  // adding the x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + axis_height + ")")
      .call(x_axis);

  // adding the y-axis
  svg.append("g")
        .attr("class", "y axis")
        .call(y_axis);

  // after svg is made, perform following fuctions to add labels and circles
  addLabels()
  addScatterCircles()
  addLegend()

  function addLabels() {
    var scatterTitle = "Unemployment Rate"
    var xLabel = "native born (%)"
    var yLabel = "foreign born (%)"

    // adding title to scatterplot
    svg.append("text")
      .attr("class", "plot")
      .attr("x", axis_width / 2 - margin.right)
      .attr("y", - (margin.top / 2))
      // .style("font-weight", "bold")
      // .style("text-decoration", "underline")
      .attr("fill", "#525252")
      .text(scatterTitle);

    // adding text labels to x axis
    svg.append("text")
      .attr("class", "axistext")
      .attr("x", axis_width - 5)
      .attr("y", axis_height - 10)
      .attr("text-anchor", "end")
      .text(xLabel);

    // adding text labels to y axis
    svg.append("text")
      .attr("class", "axistext")
      .attr("transform", "rotate(-90)")
      .attr("x", - (svg_height - axis_height - margin.top - margin.bottom))
      .attr("y", 10)
      .attr("dy", "1em")
      .attr("text-anchor", "end")
      .text(yLabel);
  }


  function addScatterCircles() {

    // loading in circles with transition
    svg.selectAll("circle")
      .data(dictionary)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", x_scaling(0))
      .attr("cy", y_scaling(0))
      .transition() // showing a transition from empty chart to bars showing up
      .duration(1500)
      .attr("cx", function(d) { return x_scaling(d.native)})
      .attr("cy", function(d) { return y_scaling(d.foreign)})


    // determine color scale for circles
    var colorDimensions = d3.scaleLinear()
      .domain([d3.min(dictionary, function(d) {
                return (d.foreign - d.native)}),
              d3.max(dictionary, function(d) {
                return (d.foreign - d.native)})
              ])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#fde0dd"), d3.rgb("#7a0177")]);

    // adding colors to circles depending on difference between foreign and native
    svg.selectAll("circle")
      .data(dictionary)
      .attr("fill", function(d) {
            return colorDimensions(d.foreign - d.native)
          })
      .style("opacity", 0.8)
      .attr("r", 9)


    // adding the tooltip bars
    // inspired by http://bl.ocks.org/Caged/6476579 (Using d3-tip to add tooltips to a d3 bar chart)
    var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-20, 0])
      .html(function(d, i) {
        return "<strong>Country: </strong> <span style='color:white' >" + dictionary[i].country + "</span>" +
        "<div><strong>Foreign:</strong> <span style='color:white' >" + dictionary[i].foreign + "</span></div>" +
        "<div><strong>Native:</strong> <span style='color:white' >" + dictionary[i].native + "</span></div>";
        })
    svg.call(tip);

    // adding tooltip bar and hiding it again
    svg.selectAll("circle")
      .on("mouseover", tip.show) // showing tooltip bars
      .on("mouseout", tip.hide) // hiding tooltip bars

    // adding a straight line, at which foreign and native Unemployment is equal
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", axis_height)
      .attr("x2", axis_width)
      .attr("y2", 0)
      .attr("stroke-width", 1.5)
      .attr("stroke", "#969696");

    // source of the datasets
    body
      .append("p")
      .text("Source: OECD Migration Statistics: Employment, Unemployment, Participation Rate")
      .attr("class", "link")
      .on("click", function() {
         window.open("http://stats.oecd.org/")
      })
    }

  function addLegend() {
    // create color density object for legend
    legendColors = ["#fde0dd", "7a0177"];

    // adding legend with two color schemes
    svg.selectAll("legend")
        .data(legendColors)
        .enter()
        .append("rect")
        .attr("class", "legend")
        .attr("x", axis_width)
        .attr("y", function(d, i){
            return 250 - (i * 30);
        })
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d){
              return d })
        .style("opacity", 0.8);

    // adding text to legend
    svg.append("text")
        .attr("font-size", "10px")
        .attr("font-family", "georgia")
        .attr("x", axis_width - 8)
        .attr("y", 230)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("Large foreign/native difference");

    svg.append("text")
        .attr("font-size", "10px")
        .attr("font-family", "georgia")
        .attr("x", axis_width - 8)
        .attr("y", 260)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("Small foreign/native difference");
      }
}
