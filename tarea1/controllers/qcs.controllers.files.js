/*
 *	This file have all the declaration of QC.controllers.projects
 *
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

QCS.Controllers.Files = [];

QCS.Controllers.Files.self = null;


/*
*	 Validate the extension of the file is a .CS
*/
QCS.Controllers.Files.ExtensionValidator = function(sName){
		// check if the name finish in .cs

	var sExtension = sName.substr( (sName.lastIndexOf('.') +1) );

	if( sExtension !== "cs" )
	{
		// insert the extension
		sName+= ".cs";
	}
	return sName;
}


/*
*	Create a new file:
*/
QCS.Controllers.Files.CreateFile = function(obj, event){


	var self = QCS.Controllers.Files.self;
	
	var sms = "New File Name:";
	bootbox.prompt(sms, function(result){
		if (result !== null) {

			$.growl({title: "Loading...", message: "Creating New File." });

			// Check the extension of the file
			var sName = self.ExtensionValidator(result);
			self.sNewFileName(sName);

			// Check if the name already exist
			if( !self.IsValidName() ){
				$.growl.error({ message: "Name already exist, action canceled." });
				return;
			}

			console.log("New file Valid name, Continue");

			// get the template
			$.ajax({url: "/terminal/processNewFile"})
		  	.done(function( jnTemplate) {

				console.log(" File Template ",jnTemplate);

				var sFileName = self.sNewFileName();

				var oPackage = {
					root : [ {	bOpen: false,
								icon: "",
								id: 0,
								leaf: true,
								parentId: 0,
								sAction: "createFile",
								sContent: jnTemplate,
								sName: sFileName,
								type: "file"
							}]
					};
				var iProjectID = self.KOCore.Controllers.Projects.GetId();

				// check if the project id was set
				if(iProjectID == null ){
					$.growl.error({ message: "No project open!, action canceled." });
					return;
				}

				console.log("oPackage",oPackage );

				$.ajax({
					type: "POST",
					url: "/terminal/processFiles/create/"+iProjectID,
					data:  JSON.stringify(oPackage),
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function(data){
						console.log("Return from server",data);

						if(typeof  data.success !== "undefined" )
						{
							if(data.success)
							{
								$.growl.success({ message: "File created successfully." });

								var oFile = oPackage.root[0];
								oFile.id = data.id;

								// Insert the package into the file system, and open it.
								self.KOCore.Models.Files.AddFile(oFile,true);

					  			return true;
							}
						}

						$.growl.error({ message: "File could not be created." });
							return true;
						},
						complete: function() {},
						error: function(xhr, textStatus, errorThrown) {
							console.log('Ajax loading error.', errorThrown);
							$.growl.error({ message: "Connection error, action canceled." });
							return false;
					 }
				});

				self.sNewFileName(self.sDefaultName);
			});
		}
	});
};


/*
*	Open this file
*/
QCS.Controllers.Files.OpenFile = function( iID ){

	var self = QCS.Controllers.Files.self;

	var oFile = self.KOCore.Models.Files.GetByID( iID );

	if( oFile !== null )
	{
		self.KOCore.Views.CodeTab.OpenFile(oFile);
	}
	else
	{
		return false;
	}
};


/*
*	Delete the file
*/
QCS.Controllers.Files.DeleteFile = function(oFile){

	var self = QCS.Controllers.Files.self;

	bootbox.confirm('Are you sure you want to delete this file? ' + oFile.sName(), function(decision) {

		if(decision){
			// Remove from the server.

			var oPackage = { root:[ {id:oFile.id() }] };
			var iProjectID = QCS.Controllers.Projects.iProjectID;

			$.growl.notice({title:"Loading...", message: "Deleting file..." });

			$.ajax({
				type: "POST",
				url: "/terminal/processFiles/destroy/"+iProjectID,
				async: false,
				data:  JSON.stringify(oPackage),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function(data){
					console.log(data);
					// Remove from the active tabs.
					self.KOCore.Views.CodeTab.Remove(oFile);
					// Remove from the model files.
					self.KOCore.Models.Files.Remove(oFile);
					$.growl.success({ message: "File deleted successfully." });
					return true;
				},
				complete: function() {},
				error: function(xhr, textStatus, errorThrown) {
					console.log('Ajax loading error.', errorThrown);
					
					$.growl.error({ message: "Connection Error, action canceled." });
					
					return false;
				}
				
			});
			
		}
		
	});
};



/*
*	KO CORE
*/
QCS.Controllers.Files.fn = function(KOCore){

	this.KOCore = KOCore;

	QCS.Controllers.Files.self = this;
	this.sDefaultName = "New File.cs";
	this.sNewFileName = ko.observable(this.sDefaultName);

	this.IsValidName = ko.computed(function() {
		var ret =  !this.KOCore.Models.Files.NameExist( this.sNewFileName() );
		return ret;
    }, this);

	this.CreateFile = QCS.Controllers.Files.CreateFile;
	this.OpenFile = QCS.Controllers.Files.OpenFile;
	this.DeleteFile = QCS.Controllers.Files.DeleteFile;
	this.ExtensionValidator = QCS.Controllers.Files.ExtensionValidator;
}