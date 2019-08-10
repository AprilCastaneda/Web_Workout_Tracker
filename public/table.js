/* AJAX Request */
// var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var req = new XMLHttpRequest();

/* Get table from server */
req.open("GET", "/get-table", true);
req.addEventListener('load', function() {
	if(req.status >= 200 && req.status < 400){
		var response = JSON.parse(req.responseText);
	
		// Build table 
		buildTable(response);
	}
	else{
		// Error statement
		document.getElementById("displayWorkout").textContent = "Error in network request: " + req.statusText;
	}
});
req.send();

/* Function that builds table */
function buildTable(exerciseData) {

	console.log(exerciseData.name);
	console.log(exerciseData["name"]);

	var tableAtMain = document.getElementById("displayWorkout");
		
	// Create table element
	var table = document.createElement("table");
		
	if(tableAtMain.firstChild != null){
		tableAtMain.removeChild(tableAtMain.firstChild);
	}

	// Create caption and append to table
	var caption = document.createElement("caption");
	caption.textContent = "Exercise Table";
	table.appendChild(caption);

	// Create tableHead
	var tableHead = document.createElement("thead");

	// Create tableHead row
	var tHeadRow = document.createElement("tr");

	var numCols = 7;

	for (var i = 0; i < numCols; i++){

		var tHeadCell = document.createElement("th");
		
		// Create headers: Name, Reps, Weight, Date, Unit
		if(i == 0){
			tHeadCell.textContent = "Name";
		}	
		else if(i == 1){
			tHeadCell.textContent = "Reps";
		}
		else if(i == 2){
			tHeadCell.textContent = "Weight";
		}
		else if(i == 3){
			tHeadCell.textContent = "Date";
		}
		else if(i == 4){
			tHeadCell.textContent = "Unit";
		}
		else if(i == 5){
			tHeadCell.textContent = "Delete";
		}
		else{
			tHeadCell.textContent = "Edit";
		}		
		
		tHeadRow.appendChild(tHeadCell);
	}

	// Append tHeadRow to tableHead and tableHead to table
	tableHead.appendChild(tHeadRow);
	table.appendChild(tableHead);

	// Create tableBody
	var tableBody = document.createElement("tbody");

	// Create rows
	exerciseData.forEach(function(rowData){

		var row = document.createElement("tr");

		/*// Only add if there's a name
		if(exerciseData["name"] != null){*/
				
			// Create cells: Name, Reps, Weight, Date, Unit, Delete, Edit
			for(var i = 0; i < numCols; i++){

				// Add cell
				var cell = document.createElement("td");
				var cellData;			
	
				if(i == 0){
					cellData = document.createTextNode(rowData["name"]);
				}
				else if(i == 1){
					cellData = document.createTextNode(rowData["reps"]);
				}
				else if(i == 2){
					cellData = document.createTextNode(rowData["weight"]);
				}
				else if(i == 3){
					cellData = document.createTextNode(rowData["date"]);
				}
				else if(i == 4){
					if(exerciseData["unit"] == 1)
						cellData = document.createTextNode("lbs");
					else
						cellData = document.createTextNode("kgs");
				}
				else if(i == 5){
					var button = document.createElement("button");
					button.innerHTML = "delete";
					cellData = button;
				}
				else{
					var button = document.createElement("button");
					button.innerHTML = "edit";
					cellData = button;
				}

				// Append cellData to cell
				cell.appendChild(cellData);
			
				// Append cell to row
				row.appendChild(cell);
			}
			
			// Append row to tableBody
			tableBody.appendChild(row);
		//}
	});
	
	// Append tableBody to table
	table.appendChild(tableBody);
		
	// Append table to tableAtMain
	tableAtMain.appendChild(table);

}

/* Add exercise to database */ 

	document.getElementById("addExercise").addEventListener("click", function(newExercise) {

	var req = new XMLHttpRequest();

	var exercise = {name:null, reps:null, weight:null, date:null, lbs:null};
	
	exercise.name = document.getElementById("newName").value;
	exercise.reps = document.getElementById("newReps").value;
	exercise.weight = document.getElementById("newWeight").value;
	exercise.date = document.getElementById("newDate").value;
	exercise.lbs = document.getElementById("newUnit").value;

	console.log(exercise.name);
	console.log(exercise.reps);
	console.log(exercise.weight);
	console.log(exercise.date);
	console.log(exercise.lbs);

	if(exercise.name == null){
		var output = document.getElementById("output");
		output.textContent = "Exercise name needs to be added";
		exercise.preventDefault();
		return;
	}
		req.open("POST", "/insert", true);
	
		req.setRequestHeader("Content-Type", "application/json");

		req.addEventListener("load", function(){
			if(req.status >= 200 && req.status < 400){
				var response = JSON.parse(req.responseText);
				console.log("I'm in addEvent");
				// Build table 
				buildTable(response);
			}
			else{
				// Error statement
				document.getElementById("displayWorkout").textContent = "Error in network request: " + req.statusText;
			}
		});
	
	req.send(JSON.stringify(exercise));
	newExercise.preventDefault();
	});

