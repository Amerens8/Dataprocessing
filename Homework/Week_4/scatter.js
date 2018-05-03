// creating a title for the index HTML page
d3.select("head").
  append("title").
  text("Week 4 Scatterplot Unemployment foreign versus native born");

// adding description to the web page
d3.select("body").style("background-color", "lightblue");

var body = d3.select("body").style("background-color", "lightblue");
body
  .append("h1")
  .text("Scatterplot Unemployment foreign versus native born");

body
  .append("h2")
  .text("Amerens Jongsma (10735666) | Minor Programmeren, Data Processing");

body
  .append("h3")
  .text("Scatterplot Unemployment foreign versus native born")

body
  .append("h3")
  .text("HALLO")

body
  .append("p")
  .text("Source: OECD.stat. Migration Statistics: Employment, Unemployment, Participation Rate by sex and place of birth")
  .attr("class", "link")
  .on("click", function() {
     window.open("http://stats.oecd.org/")
  })






var foreign15 = []
var native15 = []
var countries = []
const margin = {top: 80, bottom: 80, right: 80, left: 80}
const svg_height = 600
const svg_width = 600
axis_width = svg_width - margin.left - margin.right;
axis_height = svg_height - margin.top - margin.bottom;

window.onload = function() {

  var data_unemploy15 = "https://stats.oecd.org/SDMX-JSON/data/MIG_NUP_RATES_GENDER/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+OECD.FB+NB.MEN+WMN+TOT.U_RATE+P_RATE/all?startTime=2015&endTime=2015&dimensionAtObservation=allDimensions"
  var data_unemploy16 = "https://stats.oecd.org/SDMX-JSON/data/MIG_NUP_RATES_GENDER/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+OECD.FB+NB.MEN+WMN+TOT.U_RATE+P_RATE/all?startTime=2016&endTime=2016&dimensionAtObservation=allDimensions"

  d3.queue()
    .defer(d3.request, data_unemploy15)
    .defer(d3.request, data_unemploy16)
    .awaitAll(doFunction);
  }

// function to load data into dictionary
function doFunction(error, response) {
  // check for error when loading data
  if (error) throw error;

  data15 = JSON.parse(response[0].responseText)
  data16 = JSON.parse(response[1].responseText)

  // extract and put data from 2015 in arrays
  for (let i = 0; i < 32 ; i++){
    if (data15.structure.dimensions.observation["0"].values[i].name) {
      countries.push(data15.structure.dimensions.observation["0"].values[i].name)
    }
    // i represents countries
    var country = i + ":" + "0:2:0:0";

    // foreign total unemployed array 2015
    if (data15.dataSets[0].observations[country][0]) {
      foreign15.push(data15.dataSets[0].observations[country][0])
    }
    // native total unemployed array 2015
    var country = i + ":" + "1:2:0:0";
    if (data15.dataSets[0].observations[country][0]) {
      native15.push(data15.dataSets[0].observations[country][0])
    }
  }

  var dictionary = []
  for (let i = 0; i < countries.length; i++){
    dictionary.push({
        "country": countries[i],
        "native": native15[i],
        "foreign": foreign15[i],
    })
  }
  console.log(dictionary)
  makeSVG(dictionary)

}

// function to create CVG block
function makeSVG(dictionary) {

  // create SVG element
  var svg = body.append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xdomain = [ d3.min(dictionary, function(d){
                  return d["native"] - 1}),
                  d3.max(dictionary, function(d){
                  return d["native"] + 1})]

  var ydomain = [ d3.min(dictionary, function(d){
                  return d["foreign"] -1}),
                  d3.max(dictionary, function(d){
                  return d["foreign"] + 1})]

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

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + axis_height + ")")
      .call(x_axis);

  svg.append("g")
        .attr("class", "y axis")
        .call(y_axis);

  addLabels(svg)
  addScattercircles(svg, dictionary, x_scaling, y_scaling)

}

function addLabels(svg) {
  var scatterTitle = "Unemployment rate foreign vs. native born"
  var xLabel = "native"
  var yLabel = "foreign"

  // adding title to scatterplot
  svg.append("text")
    .attr("x", margin.left)
    .attr("y", - (margin.top / 2))
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")
    .style("text-decoration", "underline")
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
    // .attr("text-alignment", "hanging")
    .text(yLabel);

}

function addScattercircles (svg, dictionary, x_scaling, y_scaling) {

  // inspired by http://bl.ocks.org/Caged/6476579 (Using d3-tip to add tooltips to a d3 bar chart)
  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-20, 0])
    .html(function(d, i) {
      return "<strong>Country: </strong> <div style='color:white' >" + dictionary[i].country + "</div>" +
      "<strong>Foreign:</strong> <div style='color:white' >" + dictionary[i].foreign + "</div>" +
      "<strong>Native:</strong> <div style='color:white' >" + dictionary[i].native + "</div>";
      })
  svg.call(tip);

  svg.selectAll("circle")
    .data(dictionary)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", x_scaling(0))
    .attr("cy", y_scaling(0))
    .transition() // showing a transition from empty chart to bars showing up
    .duration(1500)
    .attr("cx", function(d) { return x_scaling(d.native); })
    .attr("cy", function(d) { return y_scaling(d.foreign); })



  svg.selectAll("circle")
    .data(dictionary)
    .attr("fill", function(d, i) {
      return "rgb(153, 35, " + 150*(d.foreign - d.native) + ")" // setting color to bars
    })
    .attr("r", 5)
    .on("mouseover", tip.show) // showing tooltip bars
    .on("mouseout", tip.hide) // hiding tooltip bars

    //






}
