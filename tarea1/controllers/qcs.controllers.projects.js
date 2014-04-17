/*
*	This file have all the declaration of QC.controllers.projects
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

QCS.Controllers.Projects = [];
QCS.Controllers.Projects.self = null;

QCS.Controllers.Projects.iProjectID = null;

//Prevent double triple click
QCS.Controllers.Projects.bSettingProject = false;


/*
*	Set the open project
*/
QCS.Controllers.Projects.SetProject = function( oProject ){
	var self = QCS.Controllers.Projects.self;

	if( QCS.Controllers.Projects.bSettingProject )
	{
		return;
	}
	QCS.Controllers.Projects.bSettingProject = true;
	setTimeout(function(){QCS.Controllers.Projects.bSettingProject = false; }, 800);

	// close the old open project first
	if( QCS.Controllers.Projects.iProjectID !== null){
		self.Close();
	}

	// save tehe current project id
	QCS.Controllers.Projects.OpenProject = oProject;
	self.OpenProject(oProject);
	self.OpenProjectName( oProject.sName() );
	QCS.Controllers.Projects.iProjectID = oProject.id();
	qc.api.setProject(QCS.Controllers.Projects.iProjectID);

	// Check if is in the live mode
	if( self.KOCore.Controllers.Live.isLive() ){
		self.setProjectLive(QCS.Controllers.Projects.iProjectID);
	}else{
		self.setProjectBacktest(QCS.Controllers.Projects.iProjectID);
		// Show the project dashboard
		
	}


	//Reset the console, compile and backtest buttons:
	QCS.Controllers.Compile.SetButtonState(true);
	QCS.Controllers.Compile.sCompileID = null;
	QCS.Controllers.Simulate.sSimulationID = null;
};

/*
*	Set project in live mode
*/
QCS.Controllers.Projects.setProjectBacktest = function(iProjectID){
	var self = QCS.Controllers.Projects.self;

	console.log("set project in backtest mode");

	//Remove Welcome Tab:
	QCS.Views.WelcomeTab.Hide();

	// Remove all the active tabs
	self.KOCore.Controllers.Tabs.RemoveActive();

	// Load Files
	self.KOCore.Models.Files.GetFiles( iProjectID );

	// Load results
	self.KOCore.Models.Backtests.GetBacktests( iProjectID );
};

/*
*	Set the project in Backtest Mode
*/
QCS.Controllers.Projects.setProjectLive = function(iProjectID){
	var self = QCS.Controllers.Projects.self;
	console.log("set project in live mode");
};

/*
*	Rename project
*/
QCS.Controllers.Projects.Rename = function(){
	var self = QCS.Controllers.Projects.self;
	bootbox.prompt("New Project Name:", function(result){
		if (result !== null) {
			if( !self.KOCore.Models.Projects.NameExist(result) ) {
				// Save Local
				self.OpenProject().sName( result );
				// Save Remote
				self.KOCore.Models.Projects.Rename( self.OpenProject() );
			}
			else{
				$.growl.error({ message: "Name already exists, action cancelled." });
			}
		}
	});
};



/*
*	Close project
*/
QCS.Controllers.Projects.Close = function(){
	var self = QCS.Controllers.Projects.self;
	// Remove all the active tabs
	self.KOCore.Controllers.Tabs.RemoveActive();
	QCS.Controllers.Projects.iProjectID = null;
	self.KOCore.Models.Backtests.RemoveAll();
	QCS.Views.WelcomeTab.Show();
	self.OpenProjectName("");
	self.OpenProject(null);

	$.wait(function() {
		//Re-render the scrollbar:
		globalQCScroll();
	}, 100);
};



/*
*	Delete this project from the users account:
*/
QCS.Controllers.Projects.Delete = function(obj, event) {
	var self = QCS.Controllers.Projects.self;
	//Confirm then delete project:
	bootbox.confirm("Are you sure you want to delete " + obj.sName() + "?", function(result) {
		if (result == true) {
			$.ajax({
				type: "POST",
				url: "/terminal/processProjects/destroy",
				data:  JSON.stringify({ root : [ { sName: obj.sName(), id:obj.id() } ] }),
			   contentType: "application/json; charset=utf-8",
		 	   dataType: "json",
		 	   success: function(data){
					if(typeof  data.success !== "undefined" ) {
						if (data.success) {
							// Show message of cloned
							$.growl.success({message:"Project deleted."});
							// Clear open project
							QCS.Controllers.Projects.Close();
							//Delete from local model.
							QCS.Models.Projects.RemoveProject(obj);
				  			return true;
						}
					} else {
						$.growl.error({ message: "Error deleting project, action cancelled." });
					}
					return true;
					},
				complete: function() {},
				error: function(xhr, textStatus, errorThrown) {
				 $.growl.error({ message: "Error deleting project, action cancelled." });
				 return false;
				 }
			});
		}
	});
}






/*
* 	Clones a Project from a Knockout (Project) Object
*/
QCS.Controllers.Projects.Clone = function( oProject ) {
	var self = QCS.Controllers.Projects.self;
	self.CloneProject( oProject.id(), oProject.sName() );
};





/*
*	Clone a starter algorithm
*/
QCS.Controllers.Projects.CloneStarter = function(obj, event) {
	//Load the tempalte ID from the data bind and launch a clone algorithm request.
	console.log("Clone starter algorithm: ", obj, event);

	var iProjectID = $(event.target).data('itemplateid');
	var sProjectName = $(event.target).data('sprojectname');

	if (typeof sProjectName !== 'undefined') {
		console.log("Cloning '" + sProjectName + "' with ID: " + iProjectID);
		QCS.Controllers.Projects.CloneProject(iProjectID, sProjectName);
	}

	return false;
};




/*
 *	 Clones a project from the specific existing project id and setup as default a sName for it
 */
QCS.Controllers.Projects.CloneProject = function( iProjectID, sName, sSimulationID ) {

	sName = "Clone of:" + sName;

	//BLocking message while cloning the project
	console.log("Cloning '" + sName + "' with ID: " + iProjectID);
	$.blocking({ message : "Cloning project, please wait...", timeout : -1 });

	var self = QCS.Controllers.Projects.self;
	var oPackage = { root: [
						{
							aGroups: "",
							dtCreated: "",
							dtModified: "",
							iClones: 0,
							iTemplateId: iProjectID,
							id: 0,
							sDescription: "",
							sIcon: "",
							sName: sName,
							sSparkline: "",
							sType: "local",
							sSimulationID : sSimulationID
						}
					]
				};

	// Start cloning the project
	$.ajax({
		type: "POST",
		url: "/terminal/processProjects/create",
		data:  JSON.stringify(oPackage),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
			if(typeof  data.success !== "undefined" ) {
				if(data.success) {
					// Show message of cloned
					$.growl.success({ message: "Project cloned successfully." });

					// Create a new project object
					var oNewProject = {
						id:data.id,
						projectId:data.projectId,
						sName:data.sName,
						sType:data.sType,
						sDescription: "",
						sIcon: "",
						dtCreated: QCS.Views.Console.GetTime(),
						dtModified: QCS.Views.Console.GetTime(),
						iTemplateId: "",
						aGroups: "[\"Private\"]",
						iClones: "",
						sSparkline: "",
						bFiltered: ""
					};
					// Insert the package into the file system, returns a knockout object
					var obNewProject = self.KOCore.Models.Projects.Create(oNewProject);
					// Open the new Project
					self.SetProject(obNewProject);
					bootbox.hideAll();
		  			return true;
			}
		}
			$.growl.error({ message: "Sorry project could not be cloned at this time." });
			bootbox.hideAll();
			return true;
		},
		error: function(xhr, textStatus, errorThrown) {
		 $.growl.error({ message: "Connection error, cloning cancelled." });
		 bootbox.hideAll();
		 return false;
	 	}
	});
}


/*
*
*/
QCS.Controllers.Projects.fn = function(KOCore){
	this.KOCore = KOCore;

	var self = this;
	QCS.Controllers.Projects.self = self;

	// by default the current project id its null
	this.OpenProject = ko.observable(null);
	this.OpenProjectName = ko.observable("");

	this.IsValidName = ko.computed(function() {
		var ret =  !this.KOCore.Models.Projects.NameExist( this.OpenProjectName() );
		return ret;
    }, this);

	this.CloneProject 		= QCS.Controllers.Projects.CloneProject;
	this.CloneStarter 		= QCS.Controllers.Projects.CloneStarter;
	this.Clone 				= QCS.Controllers.Projects.Clone;
	this.Rename 			= QCS.Controllers.Projects.Rename;
	this.SetProject 		= QCS.Controllers.Projects.SetProject;
	this.GetId				= QCS.Controllers.Projects.GetId;
	this.Close				= QCS.Controllers.Projects.Close;
	this.Delete				= QCS.Controllers.Projects.Delete;
	this.setProjectBacktest = QCS.Controllers.Projects.setProjectBacktest;
	this.setProjectLive 	= QCS.Controllers.Projects.setProjectLive;
}