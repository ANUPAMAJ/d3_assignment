var fs	=	require('fs');
var stream	=	require('stream')
var file	=	"Production-Department_of_Agriculture_and_Cooperation_1.csv";



fs.readFile(file,'utf-8',function(error,data)
{
	if(error)
	{
		console.log(error);
	}
	else
	{

		//var csv is the CSV file with headers
		var mycsv=data;
		function csvJSON(mycsv) {
			var lines=mycsv.split("\n");
			var result = [];
			var headers = lines[0].split(",");

			for(var i=1; i<lines.length; i++)
			{
				var obj = {};

				var row = lines[i],
				queryIdx = 0,
				startValueIdx = 0,
				idx = 0;

				if (row.trim() === '')
				 { 
				 	continue;
				  }

				while (idx < row.length)
				 {
					/* if we meet a double quote we skip until the next one */
					var c = row[idx];

					if (c === '"') 
					{
						do 
						{ 
							c = row[++idx];
						} while (c !== '"' && idx < row.length - 1);
					}

					if (c === ',' || idx === row.length - 1)
					{
						var value = row.substr(startValueIdx, idx - startValueIdx).trim();
						if (value[0] === '"')
						{
							 value = value.substr(1); 
						}
						/* skip last comma */
						if (value[value.length - 1] === ',')
						{ 
						 	value = value.substr(0, value.length - 1); 
						}
						/* skip last double quote */
						if (value[value.length - 1] === '"') 
						{
							 value = value.substr(0, value.length - 1); 
						}

						var key = headers[queryIdx++];
						obj[key] = value;
						startValueIdx = idx + 1;
					}

					++idx;
				}
				if(obj['Particulars'].includes("Commercial"))
				{
						var newobj={};
						var newobj1={}
						newobj['particulars']=obj['Particulars'];
						for(var i=1993;i<2015;i++)
						{
							if (obj[' 3-i']==='NA') 
							{
							newobj1['production']=newobj1['production'];
							}
							else
							{
							newobj1['production']=newobj1['production']+obj[' 3-i'];
							}
						}
						newobj['production']=newobj1['production'];
						result.push(newobj);
				}
				result.sort(function (a, b) 
					{
					return parseFloat(b['production'])-parseFloat(a['production']);
					}
					);
				
			}
			return result;
		}
		
		var jsondata=csvJSON(mycsv);
		//..................

		var util = require('util');
		fs.writeFileSync('./data-3.json', JSON.stringify(jsondata) , 'utf-8');
		//'''''''''''''''''''''''
	}
});