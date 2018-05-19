// linkedviews.js
//
// Amerens Jongsma (10735666)
// Dataprocessing Minor Programmeren
//
// defining regularly-used variables globally

var body = d3.select("body")
var head = d4.select("head")

// functions to run when window is initially loaded
window.onload = function() {

    // queue to load in all datasets before visualizations are made
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

  // saving all datasets in variables
  var map_data16 = response[0]
  var bar_data16 = response[1]
  var map_data17 = response[2]
  var bar_data17 = response[3]

  // default map and bar charts when opening webpage on 2017
  var current_year = '2017'
  updateYear(current_year, map_data16, bar_data16, map_data17, bar_data17)

  //update graph between 2016 and 2017 when button clicked
  d4.select("#d2016").on("click", function() {
    current_year = '2016'

    // changing the color of the buttons
    var b1 = document.getElementById("d2017")
    b1.style.background = 'gray';
    var b1 = document.getElementById("d2016")
    b1.style.background = 'green';

    // loading in new datasets of correct year
    updateYear(current_year, map_data16, bar_data16, map_data17, bar_data17)
  });

  d4.select("#d2017").on("click", function() {
    current_year = '2017'

    // changing the color of the buttons
    var b1 = document.getElementById("d2016")
    b1.style.background = 'gray';
    var b1 = document.getElementById("d2017")
    b1.style.background = 'green';

    // loading in new datasets of correct year
    updateYear(current_year, map_data16, bar_data16, map_data17, bar_data17)
  });

}
