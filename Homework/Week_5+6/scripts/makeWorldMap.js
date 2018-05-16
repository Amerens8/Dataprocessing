
function  makeWorldMap(data_json) {

  console.log(data_json)
  var scores = []
  var codes = []
  var countries = []
  var dictionary = []
  // extract and put data from dataset in arrays
  for (let i = 0; i < 38 ; i++){

    // storing country codes in an array
    country_name = data_json[i].code
    if (country_name) {
      codes.push(country_name)
    }
    // storing countries in an array
    country_name = data_json[i].country
    if (country_name) {
      countries.push(country_name)
    }

    // storing country codes in an array
    country_name = data_json[i].score
    if (country_name) {
      scores.push(country_name)
    }
  }
  //
  // console.log(countries)
  // console.log(codes)
  // console.log(scores)

  // combining previous arrays in a dictionary
  for (let i = 0; i < countries.length; i++){
    dictionary.push({
        "code": codes[i],
        "country": countries[i],
        "score": scores[i],
    })
  }


  // Datamaps expect data in format:
  // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
  //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
  var dataset = {};

  // SOURCE: http://jsbin.com/kuvojohapi/1/edit?html,output
  // We need to colorize every country based on "numberOfWhatever"
  // colors should be uniq for every value.
  // For this purpose we create palette(using min/max series-value)
  var onlyValues = dictionary.map(function(obj){ return obj.score; });
  var minValue = Math.min.apply(null, onlyValues)
  var maxValue = Math.max.apply(null, onlyValues);

  // create color palette function
  // color can be whatever you wish
  var paletteScale = d3.scale.linear()
          .domain([minValue,maxValue])
          .range(["#EFEFFF","#02386F"]); // blue color

  // console.log(dictionary)
  // fill dataset in appropriate format
  for (let i = 0; i < dictionary.length; i++){
    var iso = dictionary[i].code
    var value = dictionary[i].score
    dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value)}
  }
  // console.log(dataset)


  var map = new Datamap(
    {
      element: document.getElementById('container'),
      projection: 'mercator', // big world map

      // countries don't listed in dataset will be painted with this color
      fills: { defaultFill: '#F5F5F5' },
      data: dataset,

      geographyConfig: {
        borderColor: '#DEDEDE',
        highlightBorderWidth: 2,
        // don't change color on mouse hover
        highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
        },
        // only change border
        highlightBorderColor: '#B7B7B7',
        // show desired information in tooltip
        popupTemplate: function(geo, data) {
            // don't show tooltip if country don't present in dataset
            if (!data) { return ; }
            // tooltip content
            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Life Satisfaction: <strong>', data.numberOfThings, '</strong>',
                '</div>'].join('');
            }
          }




  });



}
