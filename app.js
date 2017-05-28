var express = require('express');
var fs = require('fs');
var Ajv = require('ajv');

var app = express();
var directory = "/public/";
app.use(express.static(__dirname + directory));


var datamodelSchema = null;
fs.readFile('datamodelSchemaM.json', 'utf8', function (err, data) {
	if (err) throw err;
	datamodelSchema = JSON.parse(data);
	console.log('model loaded');
});

var datamodel = null;
fs.readFile('datamodelM.json', 'utf8', function (err, data) {
	if (err) throw err;
	datamodel = JSON.parse(data);
	console.log('data loaded');
});


var ajv = new Ajv({allErrors: true});

function test(model, data) {
	var validate = ajv.compile(model);
	var valid = validate(data);
	if (valid){
		console.log('Valid!') 
		return 'OK';
	} else {
		//ajv.errorsText(validate.errors)
		console.log(JSON.stringify(validate.errors)); 
		return validate.errors;
	}
}


app.get('/datamodel/check', function(req, res) {	
	if (datamodelSchema == null || datamodel == null) { 
		res.send('data not loaded'); 
		return; 
	}
	var validation = test(datamodelSchema, datamodel);
	res.send(validation);
});

app.listen(8080);