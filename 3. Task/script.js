var http = require('http');
var fs = require('fs');


http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});

	fs.readFile('./data.csv', function (er, data) {
		var arr = csvJSON(new String(data));

		/* 1. STEP - extracting unique values from 'Expense Type', 'Expense area' columns*/
		var uniqueValues = extractUniqueValues(arr, 'Expense Type', 'Expense area');

		/* 2. STEP - creating structure that could represent 2 dimensional array */
		var twoDimensionalArray = crossProductOfArr(uniqueValues['uniqueArrFirst'], uniqueValues['uniqueArrSecond']);

		/* 3. STEP - populating 'table' like structure from 2. STEP*/

		/* For every row in source table (for every expense)*/
		for(var i = 0; i < arr.length; i++){
			/* Look through every pair of column/row values in 'table'*/
			for(var j = 0; j < twoDimensionalArray.length; j++){
				/*And if pair of column/row values is same as values from 'Expense Type', 'Expense area' columns */
				if( arr[i]["Expense Type"] === twoDimensionalArray[j]['row'] &&  arr[i]["Expense area"] === twoDimensionalArray[j]['column']){
					/*Add amount of that expense*/
					twoDimensionalArray[j]['sum'] = parseFloat(twoDimensionalArray[j]['sum']) + parseFloat(arr[i]["AP Amount\r"]);
				}
			}
		}

		console.log(JSON.stringify(twoDimensionalArray, null, 2));
		res.end(JSON.stringify(twoDimensionalArray, null, 2));
	})

}).listen(3000);
console.log('Server running at http://localhost:3000/');


/*HELPER FUNCTIONS*/

function csvJSON(csv) {
  var lines=csv.split("\n");
  var result = [];
  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }
	  result.push(obj);
  } 
  //return result; //JavaScript object
  return result;
}

function extractUniqueValues(arr, firstColumn, secondColumn) {
	var result = {
		uniqueArrFirst: [],
		uniqueArrSecond: []
	};
	var uniqueArrFirst = [];
	var uniqueArrSecond = [];
	
	arr.forEach(function(element) {
    	console.log(element);
    	if(result.uniqueArrFirst.indexOf(element[firstColumn]) === -1) { result.uniqueArrFirst.push(element[firstColumn]); }
    	if(result.uniqueArrSecond.indexOf(element[secondColumn]) === -1) { result.uniqueArrSecond.push(element[secondColumn]); }
	});
	return result;
}


function crossProductOfArr(arr1, arr2) {
	var crossProduct = [];
	for (var a in arr1) {
  		for (var b in arr2) {
   			crossProduct.push({ row: arr1[a], column: arr2[b], sum: 0});
  		}
	}
	return crossProduct;
}