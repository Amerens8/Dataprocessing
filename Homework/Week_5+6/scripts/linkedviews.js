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

    // var lightestColor = '#fed976'
    // var darkestColor = '#b10026'
    queue()
      .defer(d4.json, '/datasets/clean_BLIsatisf16.json')
      .defer(d4.json, '/datasets/clean_BLIindicators16.json')
      .awaitAll(makeMapAndChart);
    }

// done function to run function that make map and bar chart
function makeMapAndChart(error, response) {

  // check for error when loading data
  if (error) throw error;

  map_data = response[0];
  bar_data = response[1];
  clicked_country = 'ZAF'
  makeWorldMap(map_data, bar_data)
  // current_country_data = bar_data[18]
  makeDutchBarChart('NLD', bar_data)
  updateBarData(clicked_country, bar_data)



}
