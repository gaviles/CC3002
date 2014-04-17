/*
*	This file have all the declaration of QC.model.projects
*/

if(typeof QCS == "undefined" ) {
	QCS = [];
	QCS.Models = [];
} else if(typeof QCS.Models == "undefined") {
	QCS.Models = [];
}

// Model
function Project(data) {
    this.id = ko.observable(data.id);
    this.sType = ko.observable(data.sType);
	this.sName = ko.observable(data.sName);
	this.sDescription = ko.observable(data.sDescription);
	this.sIcon = ko.observable(data.sIcon);
	this.dtCreated = ko.observable(data.dtCreated);
	this.dtModified = ko.observable(data.dtModified);
	this.iTemplateId = ko.observable(data.iTemplateId);
	this.aGroups = ko.observable(data.aGroups);
	this.iClones = ko.observable(data.oClones);
	this.sSparkline = ko.observable(data.sSparkLine);
	this.bFiltered = ko.observable(false);
}

QCS.Models.Projects = [];

/*
*	Class Variables:
*/
QCS.Models.Projects.self = null;



/*
*	Filter the projects by group name:
*/
QCS.Models.Projects.Filter = function(sGroupName){

};



/*
*	Get a project object by its ID
*/
QCS.Models.Projects.GetProjectById = function(id) {
	var self = QCS.Models.Projects.self;
	var data = self.data();
	for(i = 0; i < data.length; i++) {
		if (data[i].id() == id) {
			return data[i];
		}
	}

	if (data.length > 0) {
		return false;
	} else {
		return;
	}
}




/*
*	Get the projects which are my algorithms
*/
QCS.Models.Projects.GetPrivates = function(){
	return this.GetByGroup("Private");
};


/*
*	Remove an existing project
*/
QCS.Models.Projects.RemoveProject = function(oProject) {
	var self = QCS.Models.Projects.self;
	self.data.remove(oProject);
	if (self.data().length == 0) {
		self.bNoProjects(true);
	}
};

/*
*	Get the projects in a specific group:
*/
QCS.Models.Projects.GetByGroup = function(sGroupSearch){
	var self = QCS.Models.Projects.self;
	var aProjects  = self.data();
   	var aGroupProjects = [];
   	for(var i = 0, iMax = aProjects.length; i < iMax; i++) {
   		if (typeof aProjects[i].aGroups() !== 'undefined') {
   			var aProjectGroups = $.parseJSON(aProjects[i].aGroups());
	   		var sGroup = aProjectGroups[0];
	   		if (sGroup == sGroupSearch) {
	   			aGroupProjects.push(aProjects[i]);
	   		}
   		}
	}
	self.bNoProjects( aGroupProjects.length < 1 );
	return aGroupProjects;
};


/*
*	Check if this name already exists: return true or false.
*/
QCS.Models.Projects.NameExist = function( sName ){
	// get the private projects
	var aProjects = QCS.Models.Projects.GetByGroup("Private");
	if( typeof aProjects !== "undefined" && aProjects.length > 0) {
		for(var i in aProjects) {
			if( sName == aProjects[i].sName() ) {
				if( this.KOCore.Controllers.Projects.OpenProject().id() != aProjects[i].id()  ) {
					return true;
				}
			}
		}
	}
	return false;
};


/*
*	Rename a project:
*/
QCS.Models.Projects.Rename = function( oProject ){

	var oPackage = {
		root : [ {
			sName: oProject.sName(),
			id:oProject.id()
		} ]
	};
	$.ajax({
		type: "POST",
		url: "/terminal/processProjects/update/",
		async: false,
		data:  JSON.stringify(oPackage),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
		console.log(data);
		return true;
		},
		complete: function() {},
		error: function(xhr, textStatus, errorThrown) {
			console.log('ajax loading error...');
			return false;
		}
	});
};



/*
*	Crates a project from a statical object ( NO Knokout object )
*	Returns: Knokcout (Project) object
*/
QCS.Models.Projects.Create = function(oProject){
	var self = QCS.Models.Projects.self;
	var oNewProject = new Project(oProject);
	self.data.push( oNewProject );
	return oNewProject;
}



/*
*	Initialize the projects
*/
QCS.Models.Projects.Initialize = function() {
	var self = QCS.Models.Projects.self;
	//Initialize the data:
    $.getJSON("/terminal/processProjects/read", function(aProjects) {
        var mappedProjects = $.map(aProjects, function(item) {
        	if (typeof item.aGroups !== 'undefined') {
        		var oGroups = JSON.parse(item.aGroups);
	        	if (oGroups.indexOf("Private") > 0) {
	        		self.bNoProjects(false);
	        	}
	        	return new Project(item);
        	}
        });
        self.data(mappedProjects);
    });
}



/*
*	KO CORE
*/
QCS.Models.Projects.fn = function(KOCore){

	//Initialize and set references:
    this.KOCore = KOCore;
    var self = this;
    QCS.Models.Projects.self = self;

    self.data = ko.observableArray([]);
    this.newProjectText = ko.observable();
    this.bNoProjects = ko.observable(true);

    //Get the private projects from the data:
    this.PrivateProjects = ko.computed(function() {
		return QCS.Models.Projects.GetPrivates();
	}, this);

    this.Create 		= QCS.Models.Projects.Create;
	this.GetPrivates 	= QCS.Models.Projects.GetPrivates;
	this.GetByGroup 	= QCS.Models.Projects.GetByGroup;
	this.NameExist		= QCS.Models.Projects.NameExist;
    this.RemoveProject 	= QCS.Models.Projects.RemoveProject;
    this.Rename 		= QCS.Models.Projects.Rename;
    this.Initialize		= QCS.Models.Projects.Initialize;
    this.GetProjectById	= QCS.Models.Projects.GetProjectById;

    this.Initialize();
};