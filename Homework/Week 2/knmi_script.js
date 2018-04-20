
/*
Dataprocessing Homework Week 2
JavaScript

Amerens Jongsma
10735666
Drawing a line graph of average temperatures, measured in De Bilt, Netherlands
*/

// get data from knmidata text file, sent out request
// did not get this part entirely and just tried something
var data = "KNMI_avg_temp_17_18.txt";
var dataFile = new XMLHttpRequest();
dataFile.onreadystatechange = function()
{
  if (this.readyState === 4 && this.status === 200)
  {
    graph(this.responseText)
  }
}
dataFile.open("GET", data, true);
dataFile.send();

// acquiring and reformatting the temperature data
const newline = "\n"
var knmi_lines = document.getElementById("knmi_data").value.split(newline);
console.log(knmi_lines);

// initializing empty lists for date and temperature to be added to later
var dates = [];
var avg_temp = [];

// loop to iterate over the data for each day measured in dataset
for (var i = 0; i < knmi_lines.length - 1; i++) {
  // remove whitespace and split where there is a comma in the line
  var tempor_line = knmi_lines[i].split(",");
  var tempor_date = tempor_line[0].trim();
  var tempor_temp = tempor_line[1].trim();

  // capture elements of date seperately and add to 'dates' list
  var year = tempor_date.substring(0, 4);
  var month = tempor_date.substring(4, 6);
  var day = tempor_date.substring(6, 8);
  var date = new Date(year, month - 1, day);

  dates.push(date);

  // capture temperatures and add to 'avg_temp' list
  avg_temp.push(Number(tempor_temp));
}


// LINE GRAPH: saving the canvas graph object
var square = document.getElementById("graph");
var context = square.getContext('2d');

// initializing location of graph and whitespaces in the canvas box outside linegraph
topspace = 70
bottomspace = 70
leftspace = 100
rightspace = 60

// leaving some white space in the canvas outside the graph
graph_width = square.width - leftspace - rightspace
graph_height = square.height - topspace - bottomspace


// creating coordinates for temperatures (on y-axis from top to bottom)
var d_temp = [300, -100];
var r_temp = [bottomspace, topspace + graph_height];

// saving first and last day in milliseconds to make easier calculations
var first_day = dates[0].getTime();
var last_day = dates[dates.length - 1].getTime();

// creating coordinates for dates (on x-axis)
var d_date = [first_day, last_day]
var r_date = [leftspace, leftspace + graph_width]

// creating a title of the graph
context.font = "15pt Verdana";
context.fillStyle = 'purple';
context.textAlign = "leftspace";
context.fillText("Average Temperature (celsius) in De Bilt (NL), 2017/2018", 170, 50);

// drawing x-axis and y-axis
context.beginPath();
context.moveTo(leftspace, topspace + graph_height);
context.lineTo(leftspace + graph_width, topspace + graph_height);
context.moveTo(leftspace, topspace + graph_height);
context.lineTo(leftspace, topspace);
context.stroke();

// labels for x-axis dates per month
var months = ['', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
var month = graph_width / (months.length - 1);
console.log(months.length)
for (var i = 0; i < 14; i++) {
  context.font = "9pt Verdana";
  context.fillText(months[i], leftspace/1.5 + (month * i), topspace + graph_height + (0.4 * bottomspace))
}

// in order to determine range of temperatures in graph, perform the following
// two lines in order to calculate the min. and max. temperature in the dataset
console.log(Math.min.apply(Math, avg_temp))
console.log(Math.max.apply(Math, avg_temp))

// labels for y-axis minimum to maximum temperature
var temperatures = [-10, -5, 0, 5, 10, 15, 20, 25, 30];
var temp_pointspace = graph_height / temperatures.length;
for (var i = 0; i < temperatures.length; i++) {
  context.font = "9pt Verdana";
  context.fillText(temperatures[i], leftspace - (leftspace/2.5), topspace + graph_height - (i * temp_pointspace) - 20)

}

// transforming the data to screen coordinates (given function in assignment)
function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

// performing createTransform function on data and store new values in arrays
var apply_transformation_temp = createTransform(d_temp, r_temp);
var apply_transformation_date = createTransform(d_date, r_date);
// creating an empty arry to store all the transformed x and y coordinates in
temp_x = []
date_y = []
for (var i = 0; i < dates.length; i++) {
  temp_x.push(apply_transformation_temp(avg_temp[i]));
  date_y.push(apply_transformation_date(dates[i]));
}

// finally drawing the line points on the graph
context.beginPath();
for (var i = 0; i < avg_temp.length; i++) {
  context.lineTo(date_y[i], temp_x[i]);
  context.stroke();
}
