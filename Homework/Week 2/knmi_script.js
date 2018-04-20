
/*
Dataprocessing Homework Week 2
JavaScript

Amerens Jongsma
10735666
Drawing a line graph of average temperatures, measured in De Bilt, Netherlands
*/

// get data from knmidata text file, sent out request
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

// LINE GRAPH
// saving the canvas graph object
var square = document.getElementById("graph");
var context = square.getContext('2d');

// creating the layout and position for the line graph
leftspace = 100
rightspace = 60
topspace = 60
bottomspace = 60

// leaving some white space in the canvas outside the graph
graph_width = square.width - leftspace - rightspace
graph_height = square.height - topspace - bottomspace

// saving lowest and highest average temperature
let min_temp = Math.min.apply(Math, avg_temp);
let max_temp = Math.max.apply(Math, avg_temp);
// creating coordinates for temperatures (on y-axis)
var d_temp = [min_temp, max_temp];
var r_temp = [bottomspace, topspace + graph_height];


// saving first and last day in milliseconds
let first_day = dates[0].getTime();
let last_day = dates[dates.length - 1].getTime();

// creating coordinates for dates (on x-axis)
var d_date = [first_day, last_day]
var r_date = [leftspace, leftspace + graph_width]


// creating a title of the graph
context.font = "15pt Verdana";
context.fillStyle = 'purple';
context.textAlign = "leftspace";
context.fillText("Average Temperature in De Bilt (NL), 2017/2018", 300, 50);

// drawing x-axis and y-axis
context.beginPath();
context.moveTo(r_date[0], topspace + graph_height);
context.lineTo(r_date[0] + graph_width, topspace + graph_height);
context.moveTo(r_date[0], topspace + graph_height);
context.lineTo(r_date[0], topspace);
context.stroke();

// labels for x-axis dates per month
var months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
var month = graph_width / (months.length - 1);
for (var i = 0; i < 13; i++) {
  context.font = "9pt Verdana";
  context.fillText(months[i], leftspace/2 + (month * i), topspace + graph_height + (0.4 * bottomspace))
}

// labels for y-axis minimum to maximum temperature
var temperatures = [-10, -5, 0, 5, 10, 15, 20, 25, 30];
var temp_pointspace = graph_height / temperatures.length;
for (var i = 0; i < temperatures.length; i++) {
  context.font = "9pt Verdana";
  context.fillText(temperatures[i], leftspace - (leftspace/2), topspace + graph_height - (i * temp_pointspace))

}



// transforming the data to screen coordinates (given in assignment)
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
temp_x = []
date_y = []
for (var i = 0; i < temperatures.length; i++) {

  temp_x.push(apply_transformation_temp(avg_temp[i]));
  date_y.push(apply_transformation_date(dates[i]));
}

context.beginPath();
for (var i=0; i < temperatures.length; i++) {
  context.lineTo(date_y[i], temp_x[i]);
  context.stroke();
}
