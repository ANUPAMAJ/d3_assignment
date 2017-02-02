var fs	=	require('fs');
var stream	=	require('stream')
var file	=	"Production-Department_of_Agriculture_and_Cooperation_1.csv";
/*Function to change csv to json*/
function csvJSON(mycsv)
{
	var lines=mycsv.split("\n"),
		result = [],
		headers = lines[0].split(",");

	for(var i=1; i<lines.length; i++)
	{
		var obj = {},
			row = lines[i],
			queryIdx = 0,
			startValueIdx = 0,
			idx = 0;

		if (row.trim() === '')
		{ 
			continue;
		}

		while (idx < row.length)
		{/* if we meet a double quote we skip until the next one */
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
				var key = headers[queryIdx++];
				obj[key] = value;
				startValueIdx = idx + 1;							
			}

			++idx;
		}
		result.push(obj);
	}
	return [result, headers];
}
/*Filtering starts here*/
var json_data = [],
	headers   = [],	
	result1   = [],
	result2   = [],
	result3   = [],
	result4   = [],
	temp = [];			
fs.readFile(file,'utf-8',function(error,data)
{
	if(error)
	{
		console.log(error);
	}
	else
	{
		var	[json_data, headers] = csvJSON(data);
		json_data.forEach(function(obj)
		{
		//Filtering For first JSON file
			if(obj['Particulars'].includes("Agricultural Production Oilseeds"))
			{
				var newobj={};
				var a = obj['Particulars'];
				newobj['particulars'] = a.substr(24);
				if (obj[' 3-2013']==='NA') 
				{
					newobj['production']=0;
				}
				else
				{
					newobj['production']=obj[' 3-2013'];
				}
				result1.push(newobj);
			}
			result1.sort(function (a, b) 
				{
					return parseFloat(b['production'])-parseFloat(a['production']);
				});

			//Filtering For Second JSON File 

			if(obj['Particulars'].includes("Agricultural Production Foodgrains"))
			{
				if (!(obj['Particulars'].includes("Yield") || 
					obj['Particulars'].includes("Foodgrains Production Foodgrains") || 
					obj['Particulars'].includes("Area") || 
					obj['Particulars'].includes("Volume")))
				{
					var newobj = {};
					    a = obj['Particulars'];
					newobj['particulars'] = a.substr(24);
					if (obj[' 3-2013']==='NA') 
					{
						newobj['production']=0;
					}
					else
					{
						newobj['production']=obj[' 3-2013'];
					}
					result2.push(newobj);
					}
				}
				result2.sort(function (a, b) 
				{
					return parseFloat(b['production'])-parseFloat(a['production']);
				});

			/*Filtering For Third JSON File*/
			if(obj['Particulars'].includes("Commercial"))
			{
				for (var k = 3, j = 0; k < headers.length; k++,j++) 
				{
					if (isNaN(temp[j])) {temp[j] = 0;}
					if(obj[headers[k]] === 'NA')
						continue;
					else
						temp[j] += parseFloat(obj[headers[k]]);
				}
			}
			/*Filtering For Fourth JSON File*/
			if(obj['Particulars'].includes("Rice Yield Andhra Pradesh")
				||obj['Particulars'].includes("Rice Yield Kerala")
				||obj['Particulars'].includes("Rice Yield Tamil Nadu")
				||obj['Particulars'].includes("Rice Yield Karnataka"))
			{
				var newobj = {};
			        b = obj[headers[0]];
			    newobj['particulars'] = b.substr(46);
				for (var k = 3, j=1993; k < headers.length; k++,j++) 
				{
					if(obj[headers[k]] === 'NA')
						newobj[j]="0";
					else
						newobj[j]=obj[headers[k]];
				}
				result4.push(newobj);
			}
		});
		for (var m=1993, l=0; m<=2014; l++, m++) 
		{
			var newobj = {};
			newobj['year'] = m;
			newobj['val'] = temp[l];
			result3.push(newobj)
		}
		//Writing filtered data into json
		fs.writeFileSync('./data-1.json', JSON.stringify(result1) , 'utf-8');
		fs.writeFileSync('./data-2.json', JSON.stringify(result2) , 'utf-8');
		fs.writeFileSync('./data-3.json', JSON.stringify(result3) , 'utf-8');
		fs.writeFileSync('./data-4.json', JSON.stringify(result4) , 'utf-8');
		//'''''''''''''''''''''''
	}
});