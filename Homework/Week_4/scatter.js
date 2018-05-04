var body = d3.select("body")
var head = d3.select("head")
window.onload = function() {
  addHeaders();
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
    .awaitAll(doFunction);
  }

// function to load data into dictionary
function doFunction(error, response) {
  // emptyin possible previously made arrays
  var foreign = []
  var native = []
  var countries = []
  var dictionary = []

  // check for error when loading data
  if (error) throw error;

  data_json = JSON.parse(response[0].responseText)

  // extract and put data from 2015 in arrays
  for (let i = 0; i < 31 ; i++){
    country_name = data_json.structure.dimensions.observation["0"].values[i].name
    if (country_name) {
      countries.push(country_name)
    }

    // i represents a country in the code
    var country = i + ":" + "0:2:0:0";
    var foreign_data = data_json.dataSets[0].observations[country][0]

    // foreign total unemployed array 2015
    if (foreign_data) {
      foreign.push(foreign_data)
    }
    // repeat steps for native total unemployed array 2015
    var country = i + ":" + "1:2:0:0";
    var native_data = data_json.dataSets[0].observations[country][0]
    if (native_data) {
      native.push(native_data)
    }
  }

  for (let i = 0; i < countries.length; i++){
    dictionary.push({
        "country": countries[i],
        "native": native[i],
        "foreign": foreign[i],
    })
  }
  makeSVG(dictionary)
}

// function to create CVG block
function makeSVG(dictionary) {
  const margin = {top: 80, bottom: 80, right: 80, left: 80}
  const svg_height = 600
  const svg_width = 600
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

  function addLabels() {
    var scatterTitle = "Unemployment Rate"
    var xLabel = "native born (%)"
    var yLabel = "foreign born (%)"

    // adding title to scatterplot
    svg.append("text")
      .attr("class", "plot")
      .attr("x", axis_width / 2 - margin.right)
      .attr("y", - (margin.top / 2))
      .style("font-size", "16px")
      .style("font-weight", "bold")
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

  // adding colors and tooltips to circles
  svg.selectAll("circle")
    .data(dictionary)
    .attr("fill", function(d, i) {
      return "rgb(153, 35, " + 150*(d.foreign - d.native) + ")" // setting color to bars
    })
    .attr("r", 8)

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

  //
  svg.selectAll("circle")
    .on("mouseover", tip.show) // showing tooltip bars
    .on("mouseout", tip.hide) // hiding tooltip bars


  // adding a straight line, at which foreign and native Unemployment is equal
  svg.append("line")
    .attr("x1", 0)
    .attr("y1", axis_height)
    .attr("x2", axis_width)
    .attr("y2", 0)
    .attr("stroke-width", 2)
    .attr("stroke", "black");

    // source of the datasets
    body
      .append("p")
      .text("Source: OECD.stat. Migration Statistics: Employment, Unemployment, Participation Rate by sex and place of birth")
      .attr("class", "link")
      .on("click", function() {
         window.open("http://stats.oecd.org/")
      })
    }
}
