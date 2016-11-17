const fs = require("fs");

var res;

//Oilseeds Crops vs Production(2013)
fs.readFile('Production-Department_of_Agriculture_and_Cooperation_1.csv', (err, data) => {
	res = [];
	if (err) 
		console.error(err);
	else {

	  	data = data.toString();
	  	var lines = data.split('\n');
	  	var headers = lines[0].split(',');

		// for(var i = 0; i < lines.length; i++) {
		lines.map(function(line) {

			var line_col = line.split(',');

			if(line_col[0].startsWith("Agricultural Production Oilseeds")) {

				// for(var j = 0; j < headers.length; j++) {
				var j = 0;
				headers.map(function(header_col) {
					if(header_col.trim() == "3-2013") {
						var obj = {};
						// console.log(line_col[0]+":"+line_col[j+1]);
						if(line_col[0].substr(33) != "") {
							// obj[line_col[0].substr(33)] = line_col[j+1];
							obj["oilseed crop type"] = line_col[0].substr(33);
							obj["production"] = line_col[j+1];
							res.push(obj);
						}
					}
					j++;
				});
			}
		});
		res.sort(function(a,b) {
			return b.production - a.production;
		});
		fs.writeFile('Oilseeds_13.json', JSON.stringify(res), (err) => {
			if(err)
				console.error(err);
			else
				console.log('File Created: Oilseeds_13.json');
		});
    }
});/* end Oilseeds Crops vs Production(2013) */