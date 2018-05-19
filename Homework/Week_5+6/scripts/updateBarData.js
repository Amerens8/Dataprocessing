// updateBarData.js
//
// Amerens Jongsma (10735666)
// Dataprocessing Minor Programmeren
//
// script to updateBarData for the variable, right Bar Chart that will be changed when
// a button of the year is clicked.


function updateBarData(clicked_country, bar_data) {

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
      var scores = [safe, employment, education, water, voter]
    }
  }
  // performt he makeBarChart function with newly passed in information
  makeBarChart(current_country_data, scores)
}
