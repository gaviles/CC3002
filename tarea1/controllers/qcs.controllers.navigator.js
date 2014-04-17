/*
*	This file have all the declaration of QCS.Controllers.Navigator
*/

if(typeof QCS == "undefined" )
{
	QCS = [];
	QCS.Controllers = [];
}
else if(typeof QCS.Controllers == "undefined")
{
	QCS.Controllers = [];
}


QCS.Controllers.Navigator = [];



/*
*	Initialize the Navigator Class:
*/
QCS.Controllers.Navigator.Initialize = function(){

	//Scan for the #open commands:
	var hash = $(location).attr('hash');
	var command = hash.split('/');

	//Make sure its a valid command.
	if (command.length != 2) {
		return;
	}

	switch(command[0]){
		case '#open':
			var oProject = QCS.Models.Projects.GetProjectById(command[1]);
			if (typeof oProject === 'undefined') {
				//Projects not loaded yet, come back here:
				$.wait(function() {QCS.Controllers.Navigator.Initialize();}, 3000);
			} else if (oProject === false) {
				//We don't own this project ID.
				return;
			} else {
				QCS.Controllers.Projects.SetProject(oProject);
			}
			break;
		default:
			//Do nothing:
	}
}



/*
*	KO CORE:
*/
QCS.Controllers.Navigator.fn = function(KOCore){
	this.KOCore = KOCore;

	/*
	*	Intialize Function Handlers:
	*/
	this.Initialize = QCS.Controllers.Navigator.Initialize;

	this.Initialize();
};