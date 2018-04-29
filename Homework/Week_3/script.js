// script.js
//
// Amerens Jongsma (10735666)
// Minor Programmeren Data Processing University of Amsterdam
//
// This main script is used as input for an html file which uses a JSON dataset
// to create a bar chart
//

// creating a title for the index HTML page
d3.select("head").
  append("title").
  text("Bar chart of Happinness in Souteast Asia");

// adding description to the web page
var body = d3.select("body").style("background-color", "lightblue");
body
  .append("h1")
  .text("Happiness Scores in Southeast Asia ");

body
  .append("h2")
  .text("Amerens Jongsma (10735666) | Minor Programmeren, Data Processing");

body
  .append("h3")
  .text("Bar chart of the Happinness Scores of countries in Southeast Asia")

body
  .append("h3")
  .text("Happiness Score is a metric measured in 2015 and 2016 by asking the \
  sampled people the question: 'How would you rate your happiness on a scale \
  of 0 to 10 where 10 is the happiest?' There are two charts that can easily \
  be prepared. Conclusion: there were only a few minor changesbetween 2015 and\
  2016. Vietnam and the Philippines switched places.")

body
  .append("p")
  .text("Source: World Happinness Report 2015/2016 (kaggle.com)")
  .attr("class", "link")
  .on("click", function() {
    window.open("https://www.kaggle.com/unsdsn/world-happiness/data")
  })

// loading in the initial JSON dataset of 2015
var value = 'clean_happ2015.json'
function updateData(value) {
  d3.json(value, function(data) {

    // setting constants and initializing global variables
    const w = 480;            // setting width of the svg element
    const h = 300;            // setting hight of the svg element
    const barPadding = 1;     // barpadding for space between the bars
    const padding = 100;      // padding to create space in the bottom left corner
    const xLabel = "Country"; // label for x axis
    const yLabel = "Happiness score"; // label for y axis
    var countries = []        // empty array to store country names in later on
    var scores = []           // empty array to store happiness scores from data

    // removing/closing previous svg in case of change of dataset clicked
    d3.select("svg").remove();

    // saving the countries and happinness scores of the dataset in seperate arrays
    for (var i = 0; i < data.length; i++){
      countries.push(data[i]["Country"])
      scores.push(Number(Number(data[i]["Happiness Score"]).toFixed(2)))
    }

    // creating an svg block element
    var svg = body.append("svg")
                .attr("width", w + (2 * padding))
                .attr("height", h + (2 * padding))

    var title;
    if (value == "clean_happ2016.json") {
      title = '2016'
    }
    else {
      title = '2015'
    }

    // adding a TITLE to the bar chart
    svg.append("text")
      .attr("x", (w / 2))
      .attr("y", (padding / 2))
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")
      .style("text-decoration", "underline")
      .text("Southeast Asia" + ', ' + title );

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
        .ticks(countries.length)
        .tickFormat(function(d, i){
          return countries[i]
        })

    var yAxis = d3.svg.axis().scale(y)
        .orient("left")
        .ticks(scores.length)

    // adding the x axis to the svg block on the correct position
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + padding + "," + (h  + padding + barPadding ) + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end" )
      .attr("dx", "0.8em")
      .attr("dy", "1.70em")
      .attr("transform", "rotate(-45)")

    // adding text labels to x axis
    svg.append("text")
      .attr("class", "axistext")
      .attr("x", w + padding + 43)
      .attr("y", h + padding + 7)
      .attr("text-anchor", "end")
      .attr("text-alignment", "hanging")
      .text(xLabel);

    // adding the y axis
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + padding + "," + padding + ")")
      .call(yAxis)

    // adding text labels to y axis
    svg.append("text")
      .attr("class", "axistext")
      .attr("x", 82)
      .attr("y", padding + 15)
      .attr("text-anchor", "end")
      .attr("text-alignment", "hanging")
      .text(yLabel);

    // inspired by http://bl.ocks.org/Caged/6476579 (Using d3-tip to add tooltips to a d3 bar chart)
    var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-20, 0])
      .html(function(d, i) {
        return "<strong>Score:</strong> <span style='color:white' >" + scores[i] + "</span>";
        })
    svg.call(tip);

    // connecting the data to rect elements in svg
    svg.selectAll("rect")
      .data(scores)
      .enter()
      .append("rect")
      .attr("class", "rect")
      .attr('width', 0)
      .attr('height', 0)
      .attr('y', h)
      .attr("fill", function(d, i) {
        return "rgb(153, 35, " + (i * 30) + ")" // setting color to bars
      })
      .on("mouseover", tip.show) // showing tooltip bars
      .on("mouseout", tip.hide) // hiding tooltip bars
      .transition() // showing a transition from empty chart to bars showing up
      .duration(1500)
      .attr("x", function(d, i) {
          return padding + i * ((w - barPadding) / data.length)
      })
      .attr("width", w / data.length - barPadding)  // defining width of each bar
      .attr("y", function(d) {
        return padding + y(d)  // data value used as y value
      })
      .attr("height", function(d) {
        return h - y(d)  // height of chart minus data value
      })

  });

}

updateData(value)
