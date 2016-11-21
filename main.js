const fs = require("fs");

fs.readFile('Production-Department_of_Agriculture_and_Cooperation_1.csv', (err, data) => {
	var res_oil = [];
	var res_food = [];
	var res_comm = [];
	var res_south = [];

	if (err) 
		console.error(err);
	else {

	  	data = data.toString();
	  	var lines = data.split('\n');
	  	var headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
	  	var sum_comm = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	  	var year_i = headers.indexOf(" 3-1993");

		lines.map(function(line) {

			var line_col = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); //split a row into its columns

			//Oilseeds Crops vs Production(2013)
			if(line_col[0].startsWith("Agricultural Production Oilseeds")) {
				var j = 0;
				headers.map(function(header_col) {
					if(header_col.trim() == "3-2013") {
						var obj = {};
						if(line_col[0].substr("Agricultural Production Oilseeds".length+1) != "") {
							obj["oilseed crop type"] = line_col[0].substr("Agricultural Production Oilseeds".length+1);
							obj["production"] = line_col[j];
							res_oil.push(obj);
						}
					}
					j++;
				});
			} // end Oilseeds Crops vs Production(2013)

			//Foodgrains Crops vs Production(2013)
			if(line_col[0].startsWith("Agricultural Production Foodgrains") && 
				(line_col[0].split("Foodgrains")[1].search(/Area|Production|Yield|Volume/) == -1)) {
				
				var j = 0;
				headers.map(function(header_col) {
					if(header_col.trim().startsWith("3-2013")) {
						var obj = {};
						if(line_col[0].substr("Agricultural Production Foodgrains".length+1) != "") {
							obj["foodgrains crop type"] = line_col[0].substr("Agricultural Production Foodgrains".length+1);
							obj["production"] = line_col[j];
							res_food.push(obj);
						}
					}
					j++;
				});
			} // end Foodgrains Crops vs Production(2013)

			//Commercial Crops Production vs Year
			if(line_col[0].startsWith("Agricultural Production Commercial Crops")) {
				var j = 0;
				var year_i = 0;
				headers.map(function(header_col) {
					if(header_col.trim().startsWith("3-")) {
						if(line_col[j].trim() != "NA" ) {
							sum_comm[year_i] += parseFloat(line_col[j].trim());
						}
						year_i++;
					}
					j++;
				});
			} // end Commercial Crops Production vs Year

		});

		//Southern States Rice Production vs Year
		headers.map(function(header_col) {
	  		if(header_col.trim().startsWith("3-")) {
	  			var obj = {};
	  			obj["year"] = header_col.trim().substr(2,4);
	  			lines.map(function(line) {
	  				var line_col = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

	  				if(line_col[0].startsWith("Agricultural Production Foodgrains Rice Yield Andhra Pradesh")) {
	  					if(line_col[year_i].trim() == "NA")
	  						obj["Andhra Pradesh"] = "" + 0;
	  					else
	  						obj["Andhra Pradesh"] = line_col[year_i];
	  				}
	  				else if(line_col[0].startsWith("Agricultural Production Foodgrains Rice Yield Karnataka")) {
	  					if(line_col[year_i].trim() == "NA")
	  						obj["Karnataka"] = "" + 0;
	  					else
	  						obj["Karnataka"] = line_col[year_i];
	  				}
	  				else if(line_col[0].startsWith("Agricultural Production Foodgrains Rice Yield Kerala")) {
	  					if(line_col[year_i].trim() == "NA")
	  						obj["Kerala"] = "" + 0;
	  					else
	  						obj["Kerala"] = line_col[year_i];
	  				}
	  				else if(line_col[0].startsWith("Agricultural Production Foodgrains Rice Yield Tamil Nadu")) {
	  					if(line_col[year_i].trim() == "NA")
	  						obj["Tamil Nadu"] = "" + 0;
	  					else
	  						obj["Tamil Nadu"] = line_col[year_i];
	  				}

	  			});
	  			year_i++;
	  			res_south.push(obj);
	  		}
	  		
	  	});// Southern States Rice Production vs Year

		/***************************
		*Sorting in descending order
		***************************/

		//Oilseed Production
		res_oil.sort(function(a,b) {
			return b.production - a.production;
		});

		//Foodgrains Production
		res_food.sort(function(a,b) {
			return b.production - a.production;
		});

		/******* End Sorting *******/


		/***************************
		*Creating JSON File
		***************************/

		//Oilseed JSON Creation
		fs.writeFile('Oilseeds_13.json', JSON.stringify(res_oil), (err) => {
			if(err)
				console.error(err);
			else
				console.log('File Created: Oilseeds_13.json');
		});

		//Foodgrains JSON Creation
		fs.writeFile('Foodgrains_13.json', JSON.stringify(res_food), (err) => {
			if(err)
				console.error(err);
			else
				console.log('File Created: Foodgrains_13.json');
		});

		//Commercial JSON Creation
		var year = 1993;
		sum_comm.map(function(prod) {
			var obj = {};
			obj["year"] = "" + year++;
			obj["Aggregate Value"] = "" + prod;
			res_comm.push(obj);
		});
		fs.writeFile('Commercial_agg.json', JSON.stringify(res_comm), (err) => {
			if(err)
				console.error(err);
			else
				console.log('File Created: Commercial_agg.json');
		});

		//Southern States 
		fs.writeFile('South_State.json', JSON.stringify(res_south), (err) => {
			if(err)
				console.error(err);
			else
				console.log('File Created: South_State.json');
		});

		/******* End Creating JSON File *******/
    }
}); 



