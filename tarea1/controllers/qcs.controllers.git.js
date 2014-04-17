/*
 *	This file have all the declaration of QCS.Controllers.Api
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

QCS.Controllers.Git = [];
QCS.Controllers.Git.self = null;

QCS.Controllers.Git.UploadKey = function(){

	var self = QCS.Controllers.Git.self;

	bootbox.dialog({
		message: "<form id=\"git-key-modal-form\"><input id=\"git-key-modal-input-file\" type=\"file\" name=\"git-key\" /></form>",
		title: "Upload Git Key",
		buttons: {
			cancel:{
				label: "Cancel",
				className: "btn-default"
			},
			main:{
				label: "Upload",
				className: "btn-primary",
				callback: function() {
					
					var oFile = document.getElementById("git-key-modal-input-file");

					if( typeof oFile === "undefined" ){
						$.growl.error({ message: "File not found." });
						return;
					}

					if(!self.IsValidFile(oFile,true)){
						// File not valid GOOUT
						return;
					}

					// The file is valid continue working
					var oFormData = new FormData($("#git-key-modal-form"));

					console.log("form data",oFormData);

					var oFormData = new FormData($("#git-key-modal-form"));
	
					var sUrl = '/terminal/processGitUploadKey/'+QCS.Controllers.Projects.iProjectID;
					
					$.ajax({
						url: sUrl,  
						type: 'POST',
						data: oFormData,
						cache: false,
						contentType: false,
						processData: false,
						beforeSend: function(){
							$.growl({ title: "Loading..", message: "Uploading Key." });
						},
						success: function(data){

							$.growl.success({ message: "Key uploaded successfully" });

							bootbox.dialog({
								message: "This is your Git URL, please save it for future reference: </br> <b>"+data+QCS.Controllers.Projects.iProjectID+"</b>",
								title: "Project Git Adress",
								buttons: {
									main: {
										label: "OK",
										className: "btn-primary"
									}
								}
							});
						},
						error: function(){
							$.growl.error({ message: "Connection Error, action canceled." });
						}
					});
				}
			}
		}
	});
}

QCS.Controllers.Git.CheckSize = function(oFile){
	
	var iSize =oFile.size;
	
	console.log("File Size",iSize);
	
	if( iSize > 1000000 )
	{
		return false;
	}
	return true
}

QCS.Controllers.Git.CheckExtension = function(oFile){
	
	var sExtension = oFile.name.substr( (oFile.name.lastIndexOf('.') +1) );
	
	sExtension = sExtension.toLowerCase();
	
	console.log("File Extension",sExtension);
	
	if( sExtension != "pub" )
	{
		return false;
	}
	return true;
}

QCS.Controllers.Git.IsValidFile = function(oFile, bNotify){

	if( bNotify !== true ){
		bNotify = false;
	}
	
	var oFile = oFile.files[0];
	
	if(QCS.Controllers.Git.CheckExtension(oFile))
	{
		if( QCS.Controllers.Git.CheckSize(oFile) )
		{
			return true;
		}
		else
		{
			if(bNotify){$.growl.error({ message: "The file is too large." });}
		}
	}
	else
	{

		if(bNotify){$.growl.error({ message: "This file extension is not allowed." });}
								
		if( !QCS.Controllers.Git.CheckSize(oFile))
		{
			if(bNotify){$.growl.error({ message: "The file is too large." });}
		}
	}
	return false;
}

QCS.Controllers.Git.fn = function(KOCore){
	this.KOCore = KOCore;

	var self = this;
	QCS.Controllers.Git.self = self;

	this.UploadKey 		= QCS.Controllers.Git.UploadKey;
	this.CheckExtension = QCS.Controllers.Git.CheckExtension;
	this.CheckSize 		= QCS.Controllers.Git.CheckSize;
	this.IsValidFile	= QCS.Controllers.Git.IsValidFile;
}