// script.js
// Amerens Jongsma (10735666)
// Minor Programmeren Data Processing University of Amsterdam
//
// This script is used as input for an html file which uses a JSON dataset
// to create a bar chart
//
// creating a title for the index HTML page
d3.select("head").
  append("title").
  text("Bar chart of  Happinness in Western Europe");

// adding description to the web page
var body = d3.select("body");
body.
  append("h1").
  text("Amerens Jongsma (10735666)");

body.
  append("h2").
  text("University of Amsterdam, Minor Programmeren");

body.
  append("h2").
  text("Bar chart of the Happinness Scores of countries in Southeast Asia \
    data obtained from https://www.kaggle.com/unsdsn/world-happiness/data \
    World Happinness Report 2015");

// loading dataset
d3.json('clean_happ2015.json', function(data) {

  // setting constants and initializing global variables
  const w = 480;            // setting width of the svg element
  const h = 300;            // setting hight of the svg element
  const barPadding = 1;     // barpadding for space between the bars
  const padding = 100;      // padding to create space in the bottom left corner
  const xLabel = "Country"; // label for x axis
  const yLabel = "Happiness score"; // label for y axis
  var countries = []        // empty array to store country names in later on
  var scores = []           // empty array to store happiness scores from data

  // saving the countries and happinness scores of the dataset in seperate arrays
  for (var i = 0; i < data.length; i++){
    countries.push(data[i]["Country"])
    scores.push(Number(Number(data[i]["Happiness Score"]).toFixed(2)))
  }

  // creating an svg block element
  var svg = body.append("svg")
              .attr("width", w + padding + 5)
              .attr("height", h + padding);

  // set the ranges and correct scaling of x and y axis
  var x = d3.scale.linear()
    .domain([0, countries.length])
    .range([0, w])
  var y = d3.scale.linear()
    .domain([0, d3.max(scores)])
    .range([h, 0])

  // define the x and y axis and scale accordingly
  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom")
  var yAxis = d3.svg.axis().scale(y)
      .orient("left")

  // adding the x axis to the svg block on the correct position
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + padding + "," + (h  + barPadding ) + ")")
    .call(xAxis)

  // adding the y axis
  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (padding)+ "," + "0)")
    .call(yAxis)

  // connecting the data to rect elements in svg
  svg.selectAll("rect")
    .data(scores)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return padding + i * ((w - barPadding) / data.length)
    })
    .attr("width", w / data.length - barPadding)  // defining width of each bar
    .attr("y", function(d) {
      return y(d)  // data value used as y value
    })
    .attr("height", function(d) {
      return h - y(d)  // height of chart minus data value
    })
    .attr("fill", "darkblue") // setting color to bars


});
