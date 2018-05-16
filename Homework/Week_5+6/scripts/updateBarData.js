function updateBarData(clicked_country, bar_data) {

  // default barChart
  var current_country_data = clicked_country
  var code = current_country_data.code       // empty array to store country names in later on
  var country = current_country_data.country         // empty array to store happiness scores from data
  var safe = Number(Number(current_country_data.safe).toFixed(2))
  var employment = Number(Number(current_country_data.employment).toFixed(2))
  var education = Number(Number(current_country_data.education).toFixed(2))
  var water = Number(Number(current_country_data.water).toFixed(2))
  var voter = Number(Number(current_country_data.voter).toFixed(2))
  var long_hours = Number(Number(current_country_data.long_hours).toFixed(2))
  var scores = [safe, employment, education, water, voter, long_hours]

  for (var i = 0; i < bar_data.length; i++) {
    if (bar_data[i].code == clicked_country) {
      current_country_data = bar_data[i]
      var code = current_country_data.code       // empty array to store country names in later on
      var country = current_country_data.country         // empty array to store happiness scores from data
      var safe = Number(Number(current_country_data.safe).toFixed(2))
      var employment = Number(Number(current_country_data.employment).toFixed(2))
      var education = Number(Number(current_country_data.education).toFixed(2))
      var water = Number(Number(current_country_data.water).toFixed(2))
      var voter = Number(Number(current_country_data.voter).toFixed(2))
      var long_hours = Number(Number(current_country_data.long_hours).toFixed(2))
      var scores = [safe, employment, education, water, voter, long_hours]
    }
  }

  makeBarChart(current_country_data, scores)
}
