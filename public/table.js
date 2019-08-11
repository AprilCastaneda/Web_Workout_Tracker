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

	// Get div id="displayWorkout" from main.handlebars
	var tableAtMain = document.getElementById("displayWorkout");
		
	// Create table element
	var table = document.createElement("table");

	// If a table already exists, delete 		
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
				if(rowData["lbs"] == 1)
					cellData = document.createTextNode("lbs");
				else
					cellData = document.createTextNode("kgs");
			}
			else if(i == 5){
				var deleteForm = document.createElement("form");
				
				var button = document.createElement("input");
				button.type = "submit";
				button.name = "id";
				button.value = rowData["id"];
				button.onclick = function() { deleteRow(this.value); };
	
				deleteForm.appendChild(button);
				cellData = deleteForm;
			}
			else{
				var editForm = document.createElement("form");

				var button = document.createElement("input");
				button.type = "submit";
				button.name = "edit";
				button.value = rowData["id"];
				button.onclick = function() { 
					promise1(this.value).then(promise2);
				 };

				editForm.appendChild(button);
				cellData = button;
			}

			// Append cellData to cell
			cell.appendChild(cellData);
		
			// Append cell to row
			row.appendChild(cell);
		}
			
		// Append row to tableBody
		tableBody.appendChild(row);
	});
	
	// Append tableBody to table
	table.appendChild(tableBody);
		
	// Append table to tableAtMain
	tableAtMain.appendChild(table);
}


/* Add exercise to database */ 
// Get data from id="addExercise" from main.handlebars
document.getElementById("addExercise").addEventListener("click", function(newExercise) {

	// New AJAX request
	var req = new XMLHttpRequest();

	// Create exercise object
	var exercise = {name:null, reps:null, weight:null, date:null, lbs:null};

	// Populate exercise object with data from main.handlebars
	exercise.name = document.getElementById("newName").value;
	exercise.reps = document.getElementById("newReps").value;
	exercise.weight = document.getElementById("newWeight").value;
	exercise.date = document.getElementById("newDate").value;

	// Get lbs
	if(document.getElementById("newUnitLbs").checked){
		exercise.lbs = document.getElementById("newUnitLbs").value;
	}
	else{
		exercise.lbs = document.getElementById("newUnitKgs").value;
	}

	// Test data is correct
	console.log(exercise.name);
	console.log(exercise.reps);
	console.log(exercise.weight);
	console.log(exercise.date);
	console.log(exercise.lbs);

	// If no name entered, do not accept data
	if(exercise.name == null){
		var output = document.getElementById("output");
		output.textContent = "Exercise name needs to be added";
		newExercise.preventDefault();
		return;
	}

	// Post request
	req.open("POST", "/insert", true);

	req.setRequestHeader("Content-Type", "application/json");

	// Get response data from server
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

	// Send exercise data to server
	req.send(JSON.stringify(exercise));
	newExercise.preventDefault();

});


/* Delete exercise from database */ 
/* Function to delete row. */
function deleteRow(tableID) {

	console.log("In delete row");

	// New AJAX request
	var req = new XMLHttpRequest();

	// Post request
	req.open("POST", "/delete", true);
	
	// Get delete row id
	var deleteID = {id:null}; 

	deleteID.id = tableID;
	console.log("Delete ID: " + tableID);

	req.setRequestHeader("Content-Type", "application/json");

	// Get response data from server
	req.addEventListener("load", function(){
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log("I'm in deleteEvent");
			// Build table 
			buildTable(response);
		}
		else{
			// Error statement
			document.getElementById("displayWorkout").textContent = "Error in network request: " + req.statusText;
		}
	});

	// Send exercise data to server
	req.send(JSON.stringify(deleteID));
}

/* Edit exercise from database */
/* Function to edit row. */
function promise1(tableID) {
	return editRow(tableID);
}

function promise2(rowInfo) {
	return editTable(rowInfo);
}


function editRow(tableID) {
	return new Promise(function(resolve, reject){

	console.log("In edit row");

	// New AJAX request
	var req = new XMLHttpRequest();
	var response;

	// Post request
	req.open("POST", "/edit", true);

	// Get edit row id
	var editID = {id:null};

	editID.id = tableID;
	console.log("Edit ID: " + tableID);

	req.setRequestHeader("Content-Type", "application/json");

	// Get response data from server
	req.addEventListener("load", function(){
		if(req.status >= 200 && req.status < 400){
			response = JSON.parse(req.responseText);
			console.log("I'm in editEvent");
			console.log(response[0]);	
			// Build edit form
		//	editTable(response);
			resolve(response);
		}
		else{
			// Error statement
			document.getElementByID("editDisplay").textContent = "Error in network request: " + req.statusText;
		}
	});
	// Send edit row data to server
	req.send(JSON.stringify(editID));
	})
}

/* Function to build edit form in edit.handlebars */
function editTable(rowData){

	// Get edit div at home.handlebars
	var editMain = document.getElementById("editWorkout");
/*
	if(editMain.firstChild != null){
		editMain.removeChild(editMain.firstChild);
	}
*/
	// Create form
	var form = document.createElement("form");
	form.name = "editForm";
	form.onsubmit = "return updateExercise();";
	var fieldset = document.createElement("fieldset");
	var legend = document.createElement("legend");

	legend.textContent = "Edit Exercise";

	// Create hidden id input
	var idDiv = document.createElement("div");
	var idInput = document.createElement("input");
	idInput.type = "hidden";
	idInput.name = "id";
	idInput.id = "editID";
	idInput.value = rowData[0].id;
	idDiv.appendChild(idInput);

	// Create name div
	var nameDiv = document.createElement("div");
	var nameLabel = document.createElement("label");
	nameLabel.for = "name";
	nameLabel.textContent = "Name";
	var nameInput = document.createElement("input");
	nameInput.type = "text";
	nameInput.name = "name";
	nameInput.id = "editName";
	nameInput.value = rowData[0].name;
	//nameInput.placeholder = this.value;
	nameDiv.appendChild(nameLabel);
	nameDiv.appendChild(nameInput);

	// Create reps div
	var repsDiv = document.createElement("div");
	var repsLabel = document.createElement("label");
	repsLabel.for = "reps";
	repsLabel.textContent = "Reps (#):";
	var repsInput = document.createElement("input");
	repsInput.type = "number";
	repsInput.name = "reps";
	repsInput.id = "editReps";
	repsInput.value = rowData[0].reps;
	repsInput.placeholder = this.value;
	repsDiv.appendChild(repsLabel);
	repsDiv.appendChild(repsInput);

	// Create weight div
	var weightDiv = document.createElement("div");
	var weightLabel = document.createElement("label");
	weightLabel.for = "weight";
	weightLabel.textContent = "Weight (#):";
	var weightInput = document.createElement("input");
	weightInput.type = "number";
	weightInput.name = "weight";
	weightInput.id = "editWeight";
	weightInput.value = rowData[0].weight;
	weightInput.placeholder = this.value;
	weightDiv.appendChild(weightLabel);
	weightDiv.appendChild(weightInput);

	// Create date div
	var dateDiv = document.createElement("div");
	var dateLabel = document.createElement("label");
	dateLabel.for = "date";
	dateLabel.textContent = "Date:";
	var dateInput = document.createElement("input");
	dateInput.type = "date";
	dateInput.name = "date";
	dateInput.id = "editDate";
	dateInput.value = rowData[0].date;
	dateInput.placeholder = this.value;
	dateDiv.appendChild(dateLabel);
	dateDiv.appendChild(dateInput);

	// Create lbs div
	var lbsDiv = document.createElement("div");
	var lbsLabel = document.createElement("label");
	lbsLabel.for = "lbs";
	lbsLabel.textContent = "Unit:";
	var lbsInput = document.createElement("input");
	lbsInput.type = "radio";
	lbsInput.name = "lbs";
	lbsInput.id = "editUnitLbs";
	lbsInput.value = "1";
	lbsInput.innerHTML = "lbs";
	var lbsLabel2 = document.createElement("label");
	lbsLabel2.textContent = "lbs";
	var kgsInput = document.createElement("input");
	kgsInput.type = "radio";
	kgsInput.name = "lbs";
	kgsInput.id = "editUnitKgs";
	kgsInput.value = "0";
	kgsInput.innerHTML = "kgs";
	var kgsLabel = document.createElement("kgs");
	kgsLabel.textContent = "kgs";
	if(rowData[0].lbs == 1){
		lbsInput.checked = "checked";
	}
	else{
		kgsInput.checked = "checked";
	}
	lbsDiv.appendChild(lbsLabel);
	lbsDiv.appendChild(lbsInput);
	lbsDiv.appendChild(lbsLabel2);
	lbsDiv.appendChild(kgsInput);
	lbsDiv.appendChild(kgsLabel);

	// Create submit div 
	var submitDiv = document.createElement("div");
	var submitInput = document.createElement("input");
	submitInput.type = "submit";
	submitInput.name = "submit edit";
	submitInput.id = "editExercise";
	submitDiv.appendChild(submitInput);

	// Append divs to form
	fieldset.appendChild(legend);
	fieldset.appendChild(idDiv);
	fieldset.appendChild(nameDiv);
	fieldset.appendChild(repsDiv);
	fieldset.appendChild(weightDiv);
	fieldset.appendChild(dateDiv);
	fieldset.appendChild(lbsDiv);
	fieldset.appendChild(submitDiv);
	form.appendChild(fieldset);

	// Append form to mainForm
	editMain.appendChild(form);

}	

/* Update database with edit submission */
// Get data from id="editExercise" from main.handlebars

function updateExercise() {

	console.log("Do I make it to listen?");
	console.log(document.forms["editForm"]["name"]);
	
	// New AJAX request
	var req = new XMLHttpRequest();

	// Create exercise object
	var exercise = {id:null, name:null, reps:null, weight:null, date:null, lbs:null};

	// Populate exercise object with data from main.handlebars
	exercise.id = document.getElementById("editID").value;
	exercise.name = document.getElementById("editName").value;
	exercise.reps = document.getElementById("editReps").value;
	exercise.weight = document.getElementById("editWeight").value;
	exercise.date = document.getElementById("editDate").value;

	// Get lbs
	if(document.getElementById("editUnitLbs").checked){
		exercise.lbs = document.getElementById("editUnitLbs").value;
	}
	else{
		exercise.lbs = document.getElementById("editUnitKgs").value;
	}

	// Test data is correct
	console.log(exercise.id);
	console.log(exercise.name);
	console.log(exercise.reps);
	console.log(exercise.weight);
	console.log(exercise.date);
	console.log(exercise.lbs);

	// If no name entered, do not accept data
	if(exercise.name == null){
		var output = document.getElementById("editWorkout");
		output.textContent = "Exercise name needs to be added";
		editExercise.preventDefault();
		return;
	}

	// Post request
	req.open("POST", "/update", true);

	req.setRequestHeader("Content-Type", "application/json");

	// Get response data from server
	req.addEventListener("load", function(){
		if(req.status >= 200 && req.status < 400){
			var response = JSON.parse(req.responseText);
			console.log("I'm in updateEvent");
			// Build table 
			buildTable(response);
		}
		else{
			// Error statement
			document.getElementById("displayWorkout").textContent = "Error in network request: " + req.statusText;
		}
	});

	// Send exercise data to server
	req.send(JSON.stringify(exercise));
	editExercise.preventDefault();


	return false;
}

	
