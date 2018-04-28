var body = d3.select("body");




  // loading dataset
  d3.json('clean_happ2016.json', function(data) {

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
    console.log(scores)
    // creating an svg block element
    var svg = body.append("svg")
                .attr("width", w + padding + 80)
                .attr("height", h + padding)


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
        .ticks(countries.length + 1)

    // adding the x axis to the svg block on the correct position
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + padding + "," + (h  + barPadding ) + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)")

    // adding text labels to x axis
    svg.append("text")
      .attr("class", "axistext")
      .attr("x", w + padding + 43 )
      .attr("y", h + 7 )
      .attr("text-anchor", "end")
      .attr("text-alignment", "hanging")
      .text(xLabel);

    // adding the y axis
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + padding + "," + "0)")
      .call(yAxis)
      .append("text")

    // adding text labels to y axis
    svg.append("text")
      .attr("class", "axistext")
      .attr("x", 82)
      .attr("y", 15)
      .attr("text-anchor", "end")
      .attr("text-alignment", "hanging")
      .text(yLabel);

    // connecting the data to rect elements in svg
    svg.selectAll("rect")
      .data(scores)
      .enter()
      .append("rect")
      .attr("class", "rect")
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
      .attr("fill", function(d, i) {
        return "rgb(1, 1, " + (i * 30) + ")" // setting color to bars
      })

  });
