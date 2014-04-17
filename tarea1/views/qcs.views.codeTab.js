/*
 *	This file have all the declaration of QC.views.resultTab
 *
 */

if(typeof QCS == "undefined" )
{
	window.QCS = [];
	window.QCS.Views = [];
}
else if(typeof QCS.Views == "undefined")
{
	window.QCS.Views = [];
}

QCS.Views.CodeTab = [];
QCS.Views.CodeTab.self = null;

QCS.Views.CodeTab.LoadFile = function(){
	console.log("load the file");
};



/*
*	Open all of the project's files.
*/
QCS.Views.CodeTab.OpenAll = function( aFiles ){
	if( typeof aFiles !== "undefined" )
	{
		if( aFiles.length > 0 )
		{
			for( var i in aFiles )
			{
				this.OpenFile( aFiles[i] );
			}
		}
	}

	//Trigger a refresh of the tab-repo calculation.
    QCS.Views.Tabs.RefreshTabScroll();
};



/*
*	Highlight the error line base on the file name and error line number
*/
QCS.Views.CodeTab.HighlightErrors = function(aErrors) {

	//Open Files.
	var files = QCS.Models.Files.GetAll();

	//Check the errors:
	if (typeof aErrors == 'undefined') { aErrors = QCS.Controllers.Compile.aErrors; }
	if (aErrors == null) { aErrors = []; }

	for(i = 0; i < files.length; i++) {
		var aAnnotations = [];
		var file = files[i];

		//Clear the existing errors:
		file.oAce.getSession().clearAnnotations();
			var aMarkers = file.oAce.getSession().getMarkers();
			for (var iMarkID in aMarkers) {
			file.oAce.getSession().removeMarker(iMarkID);
		}

		for(j = 0; j < aErrors.length; j++) {
			var cError = aErrors[j];

			//Look at each file
			if (file.sName() == cError.sErrorFilename) {
				//Matching file found, make sure its open, and then highlight the error:
				var iLine = parseInt(cError.iLine) - 1;
                var iColumn = parseInt(cError.iColumn);
                var sDescription = cError.sErrorText;
                var sType = cError.sType;

                //Fix ace line bug:
                if (iLine < 0) { iLine = 0; }

                //We have a matching tab: highlight the line in the error.
                aAnnotations.push({ row: iLine, column: iColumn, text: sDescription, type: sType });

                //Set a marker as well:
                var aceRange = ace.require('ace/range').Range;
                var cRange = new aceRange(iLine,0,iLine,100);

                if( sType == "error" ) {
                    file.oAce.getSession().addMarker(cRange,"ace_active_line_red","background", false);
                } else if( sType = "warning" ) {
                    file.oAce.getSession().addMarker(cRange,"ace_active_line_yellow","background", false);
                }

                console.log("File Annotation Added: ", file);
			} // if matching filename.
		} // for each error.

		//Set the annotation array:
        if (aAnnotations.length > 0) {
            file.oAce.getSession().setAnnotations(aAnnotations);
        }
	} // for each file.
}



/*
*	Clear the errors across all the files:
*/
QCS.Views.CodeTab.ClearErrors = function() {
	var files = QCS.Models.Files.GetAll();

	for(i = 0; i < files.length; i++) {
		var aAnnotations = [];
		var file = files[i];
		file.oAce.getSession().clearAnnotations();

		var aMarkers = file.oAce.getSession().getMarkers();
        for (var iMarkID in aMarkers) {
            file.oAce.getSession().removeMarker(iMarkID);
        }
	}
}



/*
*	Focus this error in the ACE IDE.
*/
QCS.Views.CodeTab.FocusError = function(cError) {
	var sJSON = $.hexDecode(cError);
	var cError = JSON.parse(sJSON);
	var oFiles = QCS.Models.Files.GetAll();

	//Find matching file, if not open, set open:
	for(i = 0; i < oFiles.length; i++) {
		if (!oFiles[i].bOpen() && oFiles[i].sName() == cError.sErrorFilename) {
			QCS.Views.CodeTab.OpenFile(oFiles[i]);
			$.wait(function() {
				QCS.Views.CodeTab.HighlightErrors();
			}, 75);
		}
	}
}



/*
*	Close a code tab
*/
QCS.Views.CodeTab.CloseTab = function(oFile) {
	oFile.bOpen(false);
	this.KOCore.Models.Files.SetClose( oFile.id() );

	console.log("Closing Tab", oFile.sName() );

	// Preserve an active tab "need to send the tab that you are closing"
	$('.primary-tab-header a[href="#'+oFile.codeTabId()+'"]').parent().preserveActiveTab();

	this.data.remove(oFile);

	//Trigger a refresh of the tab-repo calculation.
    QCS.Views.Tabs.RefreshTabScroll();
};



/*
*	Remove this code tab from the
*/
QCS.Views.CodeTab.Remove = function(oFile) {

	// Preserve an active tab "need to send the tab that you are closing"
	$('.primary-tab-header a[href="#'+oFile.codeTabId()+'"]').parent().preserveActiveTab();

	var self =  QCS.Views.CodeTab.self;
	self.data.remove(oFile);

	//Trigger a refresh of the tab-repo calculation.
	QCS.Views.Tabs.RefreshTabScroll();
};




/*
*	Get the HTML inside a code tab.
*/
QCS.Views.CodeTab.HtmlText = function(html){
	return html;
};




/*
*	Create the ACE object inside a tab
*/
QCS.Views.CodeTab.CreateAce = function(oFile) {

	htmlId = oFile.codeContainerId();

	var oAce = ace.edit(htmlId);
	//Set Code Mode:
	oAce.getSession().setMode("ace/mode/csharp");
	//Set theme
	oAce.setTheme("ace/theme/chrome");

	//Set the undo manager.
	var UndoManager = ace.require("ace/undomanager").UndoManager;
	oAce.getSession().setUndoManager(new UndoManager());

	oFile.oAce = oAce;

	//Set the ACE object back to the file model:
	this.KOCore.Models.Files.SetAceObject(oFile.id(), oAce);

	// Set the auto save
	this.KOCore.Views.CodeTab.StartAutoSave(oFile);
}



/*
*	Autosave File every x seconds.
*/
QCS.Views.CodeTab.StartAutoSave = function(oFile) {
	var self = this;
	if( oFile.oAce !== null )
	{
		oFile.oAce.on('change', function(el){

			// Set as unsave file
			oFile.sStatus("unsaved");

			// If time out donesn't exist create one
			if( oFile.oAutoSaveTimeout == null )
			{
				setTimeout(function(){ console.log(500); },500);
				setTimeout(function(){ console.log(1500); },1500);
				setTimeout(function(){ console.log(2000); },2000);

				console.log("Starting auto save");
				self.KOCore.Models.Files.sStatus("Saving...");
				oFile.oAutoSaveTimeout = setTimeout(function(){ self.KOCore.Views.CodeTab.Save(oFile) },2000);
			}
			else
			{
				console.log("auto save already exists");
			}
		});
	}
};



/*
*	Save a code tab file.
*/
QCS.Views.CodeTab.Save = function(oFile) {

	self = QCS.Views.CodeTab.self;

	// Auto save in the model
	oFile.sContent = oFile.oAce.getSession().getValue();

	// Set the file as saving
	oFile.sStatus("saving");

	var iProjectID = QCS.Controllers.Projects.iProjectID;

	var oPackage = {
		root : [ {
			id: oFile.id(),
			sAction: "save",
			sContent : oFile.sContent
		} ]
	};

	$.ajax({
		type: "POST",
		url: "/terminal/processFiles/update/"+iProjectID,
		async: true,
		data:  JSON.stringify(oPackage),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
		  oFile.sStatus("saved");
		  QCS.Views.CodeTab.self.KOCore.Models.Files.sStatus("Saved.");
		  QCS.Controllers.Compile.Build(true);	//Issue a silent build once finished.

		  // Remove the compile id to force the user to re build the project
		  QCS.Controllers.Compile.sCompileID = null;
		  return true;
		  
		},
		complete: function() {},
		error: function(xhr, textStatus, errorThrown) {
			console.log('Ajax loading error.', errorThrown);
			oFile.sStatus("unsaved");
			QCS.Views.CodeTab.self.KOCore.Models.Files.sStatus("Error on Save.");
			return false;
		}
	});

	// set the Auto save time out as null
	window.clearTimeout(oFile.oAutoSaveTimeout);
	oFile.oAutoSaveTimeout = null;
};



/*
*	Open a file
*/
QCS.Views.CodeTab.OpenFile = function(oFile) {

	var self = QCS.Views.CodeTab.self;
	var bOpen = oFile.bOpen();

	if (!bOpen) {
		oFile.bOpen(true);
		self.data.push(new File({	id:oFile.id(),
									icon:oFile.icon(),
									type:oFile.type(),
									sName:oFile.sName(),
									sContent:oFile.sContent,
									sAction:oFile.sAction()})
						);
	}

	$.wait( function(){ self.KOCore.Controllers.Tabs.SetActive('menu-tab-header',oFile.codeTabId()) } ,50 );

	//Trigger a refresh of the tab-repo calculation.
	QCS.Views.Tabs.RefreshTabScroll();
}



/*
*	Get all the data:
*/
QCS.Views.CodeTab.GetAll = function() {
	var self = QCS.Views.CodeTab.self;
	return self.data();
}



/*
*	Remove all the data:
*/
QCS.Views.CodeTab.RemoveAll = function() {
	var self = QCS.Views.CodeTab.self;
	self.data.removeAll();
}



/*
*	KO CORE:
*/
QCS.Views.CodeTab.fn = function(KOCore){

	this.KOCore = KOCore;
	var self = this;
	self.data = ko.observableArray([]);

	QCS.Views.CodeTab.self = self;

    this.OpenFile 		= QCS.Views.CodeTab.OpenFile;
   	this.GetAll 		= QCS.Views.CodeTab.GetAll;
  	this.RemoveAll		= QCS.Views.CodeTab.RemoveAll;
    this.HtmlId 		= QCS.Views.CodeTab.HtmlId;
	this.OpenAll 		= QCS.Views.CodeTab.OpenAll;
	this.CloseTab		= QCS.Views.CodeTab.CloseTab;
	this.HtmlText		= QCS.Views.CodeTab.HtmlText;
	this.CreateAce		= QCS.Views.CodeTab.CreateAce;
	this.LoadFile 		= QCS.Views.CodeTab.LoadFile;
	this.Save 			= QCS.Views.CodeTab.Save;
	this.StartAutoSave 	= QCS.Views.CodeTab.StartAutoSave;
	this.Remove 		= QCS.Views.CodeTab.Remove;
	this.HighlightErrors= QCS.Views.CodeTab.HighlightErrors;
	this.ClearErrors	= QCS.Views.CodeTab.ClearErrors;
};
