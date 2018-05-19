function  makeWorldMap(current_year, map_data16, bar_data16, map_data17, bar_data17) {

  var scores = []
  var codes = []
  var countries = []
  var dictionary = []

  // extract and put data from dataset in arrays
  for (let i = 0; i < map_data.length ; i++){

    // storing country codes in an array
    country_name = map_data[i].code
    if (country_name) {
      codes.push(country_name)
    }
    // storing countries in an array
    country_name = map_data[i].country
    if (country_name) {
      countries.push(country_name)
    }

    // storing country codes in an array
    country_name = map_data[i].score
    if (country_name) {
      scores.push(country_name)
    }
  }


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

  var lightestColor = '#fed976'
  var darkestColor = '#b10026'

  // create color palette function
  var paletteScale = d3.scale.linear()
          .domain([minValue,maxValue])
          .range([darkestColor, lightestColor])

  // fill dataset in appropriate format
  for (let i = 0; i < dictionary.length; i++){
    var iso = dictionary[i].code
    var value = dictionary[i].score
    dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value)}
  }


  var fills = {
    defaultFill: '#F5F5F5',
    // someOtherFill: '#ff0000'
    'Low Satisfaction (<5%)': darkestColor,
    'Middle Satisfaction (6.5%)': '#df8155',
    'High Satisfaction (>7.5%)': lightestColor
  };


  var map = new Datamap(
    {
      element: document.getElementById('worldmap'),
      projection: 'mercator', // big world map

      // countries don't listed in dataset will be painted with default color
      fills: fills,
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
          },
        // source: https://bl.ocks.org/briwa/60024d70a5aee921d5910828fe8115be
        done: function(datamap) {
          datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            var clicked_country = geography.id;
            var fillkey_obj = datamap.options.data[clicked_country] || {fillKey: 'defaultFill'};
            var fillkey = fillkey_obj.fillKey;;
            var fillkeys = Object.keys(fills);
            var antikey = fillkeys[Math.abs(fillkeys.indexOf(fillkey) - 1)];
            var new_fills = {
              [geography.id] : {
                fillKey: antikey
              }
            };
            datamap.updateChoropleth(new_fills);
            updateBarData(clicked_country, bar_data);

        });
      }
  })

  document.getElementById('worldmap')
  // drawing the map's legend
  // d4.select("#worldmap").
  map.legend();




}
