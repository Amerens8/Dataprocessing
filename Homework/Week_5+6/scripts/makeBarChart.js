function makeBarChart() {
  var value = '/datasets/clean_BLIindicators17.json'
  console.log(value)
  updateData(value)
  function updateData(value) {
    d4.json(value, function(data) {

      // setting constants and initializing global variables
      const svg_width = 480;            // setting width of the svg element
      const svg_height = 300;            // setting hight of the svg element
      const barPadding = 1;     // barpadding for space between the bars
      const padding = 100;      // padding to create space in the bottom left corner
      const xLabel = "Country"; // label for x axis
      const yLabel = "Percentage"; // label for y axis
      var countries = []        // empty array to store country names in later on
      var scores = []           // empty array to store happiness scores from data

      // removing/closing previous svg in case of change of dataset clicked
      // d4.select("svg").remove();

      // saving the countries and happiness scores of the dataset in seperate arrays
      for (var i = 0; i < data.length; i++){
        countries.push(data[i]["Country"])
        scores.push(Number(Number(data[i]["Happiness Score"]).toFixed(2)))
      }

      // creating an svg block element
      var svg = body.append("svg")
                  .attr("width", svg_width + (2 * padding))
                  .attr("height", svg_height + (2 * padding))

      var title;
      if (value == "clean_happ2016.json") {
        title = '2016'
      }
      else {
        title = 'a country'
      }

      // adding a TITLE to the bar chart
      svg.append("text")
        .attr("x", (svg_width / 2))
        .attr("y", (padding / 2))
        .attr("class", "plot")
        .attr("fill", "#525252")
        .text("Better Life details about " + title );

      // set the ranges and correct scaling of x and y axis
      var x = d3.scale.linear()
        .domain([0, countries.length])
        .range([0, svg_width])
      var y = d3.scale.linear()
        .domain([0, d3.max(scores)])
        .range([svg_height, 0])

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
        .attr("transform", "translate(" + padding + "," + (svg_height  + padding + barPadding ) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end" )
        .attr("dx", "0.8em")
        .attr("dy", "1.70em")
        .attr("transform", "rotate(-45)")

      // adding text labels to x axis
      svg.append("text")
        .attr("class", "axistext")
        .attr("x", svg_width + padding + 43)
        .attr("y", svg_height + padding + 7)
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
        .attr('y', svg_height)
        .attr("fill", function(d, i) {
          return "rgb(153, 35, " + (i * 30) + ")" // setting color to bars
        })
        .on("mouseover", tip.show) // showing tooltip bars
        .on("mouseout", tip.hide) // hiding tooltip bars
        .transition() // showing a transition from empty chart to bars showing up
        .duration(1500)
        .attr("x", function(d, i) {
            return padding + i * ((svg_width - barPadding) / data.length)
        })
        .attr("width", svg_width / data.length - barPadding)  // defining width of each bar
        .attr("y", function(d) {
          return padding + y(d)  // data value used as y value
        })
        .attr("height", function(d) {
          return svg_height - y(d)  // height of chart minus data value
        })

    });

  }
}
