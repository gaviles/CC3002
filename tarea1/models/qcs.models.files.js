/*
 *	This file have all the declaration of QC.model.projects
 *
 */

if(typeof QCS == "undefined" )
{
	window.QCS = [];
	window.QCS.Models = [];
}
else if(typeof QCS.Models == "undefined")
{
	window.QCS.Models = [];
}

/*
*	Define the name space:
*/
QCS.Models.Files = [];
QCS.Models.Files.self = null;


/*
*	Class Variables:
*/



/*
*	File Model:
*/
function File(data) {
    this.id = ko.observable(data.id);
    this.icon = ko.observable(data.icon);
	this.type = ko.observable(data.type);
	this.sName = ko.observable(data.sName);
	this.sContent = data.sContent;
	this.sAction = ko.observable(data.sAction);
	this.bOpen = ko.observable(false);
	this.sStatus = ko.observable("saved");

	this.codeTabId = ko.computed(function() {
        return 'code-tab-'+this.id();
    }, this);

    this.codeContainerId = ko.computed(function() {
        return 'code-area-'+this.id();
    }, this);

    this.oAutoSaveTimeout = null;
    this.oAce = null;
}



/*
*	Set this file as closed.
*/
QCS.Models.Files.SetClose = function( iID ){

	var aFiles = this.data();

	for( var i in aFiles )
	{
		if( aFiles[i].id() == iID )
		{
			aFiles[i].bOpen(false);
		}
	}
}



/*
*	Set the ACE object back to the file model:
*/
QCS.Models.Files.SetAceObject = function(iID, oAce) {
	var aFiles = this.data();

	for( var i in aFiles )
	{
		if( aFiles[i].id() == iID )
		{
			aFiles[i].oAce = oAce;
		}
	}
}



/*
*	Get the files, using the project ID.
*	Require the project id
*/
QCS.Models.Files.GetFiles =  function( iPID, callback ){

	if( typeof callback == "undefined" )
	{
		callback = function(){}
	}

    var self = this;

    self.sStatus("Downloading...");

	console.log("Loading Files of "+iPID+" project");

	this.KOCore.Views.LoadingTab.Show();

	$.getJSON("/terminal/processFiles/read/"+iPID, function(jnFiles) {

    	if( jnFiles !== null )
    	{
			var aFiles = jnFiles.root;

			// Map only the files, filtering the folders
			aFiles = self.MapFiles(aFiles);

	        var mappedFiles = $.map(aFiles, function(item) { return new File(item) });
	        self.data(mappedFiles);

	        // open all the files
	      	self.KOCore.Views.CodeTab.OpenAll(mappedFiles);
		}
		self.KOCore.Views.LoadingTab.Hide();
		self.sStatus("Loaded.");
		callback();
    });
};



/*
*	Loop over files in model and make sure theyre all state saved.
*/
QCS.Models.Files.AllSaved =  function() {
	for (index = 0; index < QCS.Models.Files.length; ++index) {
		if (QCS.Models.Files[index].sState != 'saved') {
			return false;
		}
	}
	return true;
}



/*
*	Check if this name already exists: return true or false.
*/
QCS.Models.Files.NameExist = function( sName ){

	var self = this;
	var aFiles = this.data();

	if( typeof aFiles !== "undefined" )
	{
		for(var i in aFiles)
		{
			console.log(sName,aFiles[i].sName(),sName == aFiles[i].sName());
			if( sName == aFiles[i].sName() )
			{
				return true;
			}
		}
	}

	return false;
}



/*
*	Get file by ID.
*/
QCS.Models.Files.GetByID = function( iID ){

	var self = this;

	var aFiles = this.data();

	console.log(aFiles);

	if( typeof aFiles !== "undefined" )
	{
		for(var i in aFiles)
		{
			if( iID == aFiles[i].id() )
			{
				return aFiles[i];
			}
		}
	}

	return null;
}



/*
*	Remove the file:
*/
QCS.Models.Files.Remove = function( oFile ){

	var self =  QCS.Models.Files.self;
	self.data.remove(oFile);
};



/*
*	Map files, filtering folders and return the new array
*/
QCS.Models.Files.MapFiles = function( aFiles ){

	var self = QCS.Models.Files.self;

	var aMappedFiles = [];

	for( var i in aFiles )
	{
		if( aFiles[i].type == "file"  ){

			aMappedFiles.push(aFiles[i]);

		}else if( aFiles[i].type == "folder" ){

			var aTempFiles = QCS.Models.Files.MapFiles( aFiles[i].root  );

			for( var j in aTempFiles ){
				aMappedFiles.push( aTempFiles[j] );
			}
		}
	}
	return aMappedFiles;
}



/*
*	Create a new file from a static object with the data inside
*/
QCS.Models.Files.AddFile = function( oFile, bOpen ){

	var  self = QCS.Models.Files.self;

	// object file
	var obFile = new File(oFile);

	self.data.push(obFile);

	if( bOpen == true ){
		self.KOCore.Views.CodeTab.OpenFile(obFile);
	}
}



/*
*	Get all the data from the files.
*/
QCS.Models.Files.GetAll = function() {
	var self = QCS.Models.Files.self;
	return self.data();
}



/*
*	KO CORE
*/
QCS.Models.Files.fn = function(KOCore){

    this.KOCore = KOCore;
    var self = this;
    QCS.Models.Files.self = self;

    self.data 			= ko.observableArray([]);
	self.sStatus		= ko.observable("");
    self.notOpenFiles 	= ko.observableArray([]);

    this.GetAll		= QCS.Models.Files.GetAll;
    this.SetClose	= QCS.Models.Files.SetClose;
    this.GetFiles	= QCS.Models.Files.GetFiles;
    this.AllSaved	= QCS.Models.Files.AllSaved;
    this.NameExist	= QCS.Models.Files.NameExist;
    this.GetByID	= QCS.Models.Files.GetByID;
    this.AddFile	= QCS.Models.Files.AddFile;
    this.MapFiles 	= QCS.Models.Files.MapFiles;
    this.Remove 	= QCS.Models.Files.Remove;
    this.SetAceObject = QCS.Models.Files.SetAceObject;
};