// linkedviews.js
//
// Amerens Jongsma (10735666)
// Dataprocessing Minor Programmeren

// defining regularly-used variables globally
var body = d3.select("body")
var head = d4.select("head")

// functions to run when window is initially loaded
window.onload = function() {
    // var dataset = "https://stats.oecd.org/SDMX-JSON/data/MIG_NUP_RATES_GENDER/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+OECD.FB+NB.MEN+WMN+TOT.U_RATE+P_RATE/all?startTime=2015&endTime=2015&dimensionAtObservation=allDimensions"
    // var data_unemploy16 = "https://stats.oecd.org/SDMX-JSON/data/MIG_NUP_RATES_GENDER/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+OECD.FB+NB.MEN+WMN+TOT.U_RATE+P_RATE/all?startTime=2016&endTime=2016&dimensionAtObservation=allDimensions"
    queue()
      .defer(d4.json, '/datasets/clean_BLIsatisf17.json')
      .defer(d4.json, '/datasets/clean_BLIindicators17.json')
      .awaitAll(makeMapAndChart);
    }

// done function to run function that make map and bar chart
function makeMapAndChart(error, response) {

  // check for error when loading data
  if (error) throw error;

  map_data = response[0]
  bar_data = response[1]

  makeWorldMap(map_data)


  var clicked_country = 'NLD'
  var current_country_data
  for (var i = 0; i < bar_data.length; i++){
    if (bar_data[i].code == clicked_country) {
      current_country_data = bar_data[i]
      break;
    }
    else {
      current_country_data = bar_data[0]
    }
  }
  console.log(current_country_data)

  makeBarChart(current_country_data)


}
