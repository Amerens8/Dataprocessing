// linkedviews.js
//
// Amerens Jongsma (10735666)
// Dataprocessing Minor Programmeren

// defining regularly-used variables globally
var body = d3.select("body")
var head = d4.select("head")

// functions to run when window is initially loaded
window.onload = function() {

    queue()
      .defer(d4.json, '/datasets/clean_BLIsatisf16.json')
      .defer(d4.json, '/datasets/clean_BLIindicators16.json')
      .defer(d4.json, '/datasets/clean_BLIsatisf17.json')
      .defer(d4.json, '/datasets/clean_BLIindicators17.json')
      .awaitAll(makeMapAndChart);


    }

// done function to run function that make map and bar chart
function makeMapAndChart(error, response) {
  // check for error when loading data
  if (error) throw error;


  // // default year (2017)
  var map_data16 = response[0]
  var bar_data16 = response[1]
  var map_data17 = response[2]
  var bar_data17 = response[3]
  console.log(response[0])

  //update graph between 2016 and 2017
  d4.select("#d2016").on("click", function() {

    map_data = response[0]
    bar_data = response[1]
    console.log(map_data[0])
  });

  d4.select("#d2017").on("click", function() {
    console.log("hallo")
    map_data = response[2]
    bar_data = response[3]

  });

console.log(map_data[0])


  clicked_country = 'ZAF'
  makeWorldMap(map_data, bar_data)
  makeDutchBarChart('NLD', bar_data)
  updateBarData(clicked_country, bar_data)


}
