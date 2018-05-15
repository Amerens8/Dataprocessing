
function  makeWorldMap() {
  var map = new Datamap(
    {
      element: document.getElementById('container'),

    // changing the color of the map
      fills: {
        defaultFill: 'darkblue' // Any hex, color name or rgb/rgba value
      }
    });

} // end of makeWorldMap
