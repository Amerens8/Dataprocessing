// updateYear.js
//
// Amerens Jongsma (10735666)
// Dataprocessing Minor Programmeren
//
// script to update the year when the year button is clicked

function updateYear(current_year, map_data16, bar_data16, map_data17, bar_data17) {
  d4.selectAll("svg").remove()
  if (current_year == '2016') {
    map_data = map_data16
    bar_data = bar_data16
  }
  else {
    map_data = map_data17
    bar_data = bar_data17
  }

  clicked_country = 'ZAF'
  makeWorldMap(current_year, map_data, bar_data)
  makeDutchBarChart('NLD', bar_data)
  updateBarData(clicked_country, bar_data)
}
