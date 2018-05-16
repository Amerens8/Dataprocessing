function makeBarChart(current_country_data) {

  // setting constants and initializing global variables
  const margin = {top: 200, bottom: 200, right: 200, left: 200}
  const svg_height = 888
  const svg_width = 888
  axis_width = svg_width - margin.left - margin.right;
  axis_height = svg_height - margin.top - margin.bottom;

  const barPadding = 1;     // barpadding for space between the bars

  const xLabel = ""; // label for x axis
  const yLabel = "Percentage"; // label for y axis
  var code = current_country_data.code       // empty array to store country names in later on
  var country = current_country_data.country         // empty array to store happiness scores from data
  var safe = Number(Number(current_country_data.safe).toFixed(2))
  var employment = Number(Number(current_country_data.employment).toFixed(2))
  var education = Number(Number(current_country_data.education).toFixed(2))
  var water = Number(Number(current_country_data.water).toFixed(2))
  var voter = Number(Number(current_country_data.voter).toFixed(2))
  var long_hours = Number(Number(current_country_data.long_hours).toFixed(2))
  var scores = [safe, employment, education, water, voter, long_hours]
  console.log(scores)

  // removing/closing previous svg in case of change of dataset clicked
  // d4.select("svg").remove();

  // saving the countries and happiness scores of the dataset in seperate arrays
  // for (var i = 0; i < 38; i++){
  //   countries.push(current_country_data[i].country)
  //   scores.push(Number(Number(current_country_data[i]["safe"]).toFixed(2)))
  // }


  var svg = body
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var title = current_country_data.country;

  // adding a TITLE to the bar chart
  svg.append("text")
    .attr("x", 0)
    .attr("y", - margin.top / 4)
    .attr("class", "plot")
    .attr("fill", "#525252")
    .text("Better Life details about " + title );

  // set the ranges and correct scaling of x and y axis
  var x_scaling = d3.scale.linear()
    .domain([0, 6])
    .range([0, axis_width])
  var y_scaling = d3.scale.linear()
    .domain([0, 100])
    .range([axis_height, 0])

  var x_axis_labels = ['feeling safe', 'employment rate', 'education', 'water quality', 'voter turnout', 'long hours']
  // define the x and y axis and scale accordingly
  var xAxis = d3.svg.axis().scale(x_scaling)
      .orient("bottom")
      .ticks(6)
      .tickFormat(function(d, i){
        return x_axis_labels[i]
      })

  var yAxis = d3.svg.axis().scale(y_scaling)
      .orient("left")
      .ticks(10)

  // adding the x axis to the svg block on the correct position
  svg.append("g")
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
    .attr("class", "axistext")
    .attr("x", svg_width + margin.left + 43)
    .attr("y", svg_height + margin.left + 7)
    .attr("text-anchor", "end")
    .attr("text-alignment", "hanging")
    .text(xLabel);

  // adding the y axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  // adding text labels to y axis
  svg.append("text")
    .attr("class", "axistext")
    .attr("x", 82)
    .attr("y", margin.left + 15)
    .attr("text-anchor", "end")
    .attr("text-alignment", "hanging")
    .text(yLabel);

  // inspired by http://bl.ocks.org/Caged/6476579 (Using d3-tip to add tooltips to a d3 bar chart)
  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-20, 0])
    .html(function(d, i) {
      return "<strong>Score:</strong> <span style='color:white' >" + scores[i] + "% </span>";
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
    .attr('y', axis_height)
    .attr("fill", function(d, i) {
      return "rgb(153, 35, " + (i * 30) + ")" // setting color to bars
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
      return axis_height - y_scaling(d)  // height of chart minus data value
    })

  // adding tooltips
  svg.selectAll("rect")
    .on("mouseover", tip.show) // showing tooltip bars
    .on("mouseout", tip.hide) // hiding tooltip bars


}
