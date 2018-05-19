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

  var current_year = '2017'
  updateYear(current_year, map_data16, bar_data16, map_data17, bar_data17)
  //update graph between 2016 and 2017
  d4.select("#d2016").on("click", function() {
    current_year = '2016'
    updateYear(current_year, map_data16, bar_data16, map_data17, bar_data17)
  });

  d4.select("#d2017").on("click", function() {
    current_year = '2017'
    updateYear(current_year, map_data16, bar_data16, map_data17, bar_data17)
  });


}
