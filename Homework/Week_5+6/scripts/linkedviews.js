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
    makeMapAndChart()
    // d3.queue()
    //   .defer(d3.request, dataset)
    //   .defer(d3.request, data_unemploy16)
    //   .awaitAll(makeMapAndChart);
  }

// done function to run function that make map and bar chart
function makeMapAndChart() {

    makeBarChart()
    makeScatter()
    makeWorldMap()
}



function  makeWorldMap() {
  var map = new Datamap(
    {
      element: document.getElementById('container'),

    // changing the color of the map
      fills: {
        defaultFill: 'pink' // Any hex, color name or rgb/rgba value
      }
    });

} // end of makeWorldMap
