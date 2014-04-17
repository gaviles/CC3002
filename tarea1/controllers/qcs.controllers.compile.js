/*
 *	This file have all the declaration of QCS.Controllers.Compile
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

QCS.Controllers.Compile = [];


/*
*	Public Initialize the Variables:
*/
QCS.Controllers.Compile.sCompileID = false;
QCS.Controllers.Compile.bAutoSimulate = false;
QCS.Controllers.Compile.oBuildTimer = false;
QCS.Controllers.Compile.bButtonEnabled = true;
QCS.Controllers.Compile.aErrors = null;


/*
*	Initialize the Compile API.
*/
QCS.Controllers.Compile.Initialize = function() {
	//Loop back to this later if the API hasn't loaded yet:
	if (typeof qc.api == "undefined") {
		setTimeout(QCS.Controllers.Compile.Initialize, 100);
	}
	//Timeout Storage:
	QCS.Controllers.Compile.oBuildTimer = null;
	console.log("Compiler Initialized.");
}


/*
*	Build the currently open project
*/
QCS.Controllers.Compile.Build = function(bSilent, bAutoSimulate){

	//Bounce out of handler if button disabled:
	if (!QCS.Controllers.Compile.bButtonEnabled) return false;

	//Set the autosimulate:
	if (typeof bAutoSimulate == 'undefined') bAutoSimulate = false;
	QCS.Controllers.Compile.bAutoSimulate = bAutoSimulate;

	//Send build request:
	if (typeof QCS.Controllers.Projects.iProjectID != "undefined" && QCS.Controllers.Projects.iProjectID > 0) {
        if (bSilent === false) {
            QCS.Views.Console.Open();
			QCS.Controllers.Compile.SetButtonState(false);
            QCS.Views.Console.AddText("Building Project ID: " + QCS.Controllers.Projects.iProjectID);
        }

        //Send the command to QC API.
        qc.api.build(bSilent, function() {
            //Success in sending the request -- do nothing.
        }, function(sError) {
            this.bAutoSimulate = false;
            QCS.Views.Console.AddText("Error in Build Request: " + sError.sResponseCode);
            QCS.Controllers.Compile.SetButtonState(true);
			console.log(sError);
            if(sError.sResponseCode == '401 UNAUTHORIZED') {
                $.growl.error({message : 'Your login session has expired. For your security please login again.'});
            }
        });
    } else {
    	$.growl.error({message : "Please open a project before initiating a build request."});
    }
}


/*
*	Send a compiler build error message to console.
*/
QCS.Controllers.Compile.BuildError = function(aProperties, aErrors){

	QCS.Controllers.Compile.sCompileID = null;

	//Display the errors in the console:
	for(i = 0; i < aErrors.length; i++) {
		var cError = aErrors[i];
		var sJSONError = JSON.stringify(cError);
		var sHex = $.hexEncode(sJSONError);
		var sMessage = '<a href="#" onClick="QCS.Views.CodeTab.FocusError(\'' + sHex + '\')">Build Error: File: ' + cError.sErrorFilename + ' Line:' + cError.iLine + ' Column:' + cError.iColumn + ' - ' + cError.sErrorText + '</a>';

		//Write to console:
		QCS.Views.Console.AddText(sMessage, 'error');
	}

	QCS.Controllers.Compile.SetButtonState(true);
	QCS.Views.CodeTab.HighlightErrors(aErrors);
	QCS.Controllers.Compile.aErrors = aErrors;
}


/*
*	Send a build success message to console.
*/
QCS.Controllers.Compile.BuildSuccess = function(cBuildData){
	if (cBuildData.iProjectID != QCS.Controllers.Projects.iProjectID) {
	    return;
	}

	QCS.Views.Console.AddText("Build Request Successful for Project ID: " + cBuildData.iProjectID  + ", with CompileID: " + cBuildData.sCompileID);
	QCS.Controllers.Compile.sCompileID = cBuildData.sCompileID;

	QCS.Controllers.Compile.SetButtonState(true);
	QCS.Controllers.Simulate.SetButtonState(true);

	if(QCS.Controllers.Compile.bAutoSimulate)
    {
        QCS.Controllers.Simulate.Backtest();
        this.bAutoSimulate = false;
    }

    QCS.Views.CodeTab.ClearErrors();
    QCS.Controllers.Compile.aErrors = null;
}


/*
*	Disable the build button while we're waiting for the build result.
*/
QCS.Controllers.Compile.SetButtonState = function(bEnabled, sButtonText){
	QCS.Controllers.Compile.bButtonEnabled = bEnabled;
	if (bEnabled) {
		$('#tab-build').disable(false);
		$('#tab-build .button-description').html("Build");
	} else {
		$('#tab-build').disable(true);
		$('#tab-build .button-description').html("Building...");
	}
	if (sButtonText != null) $('#tab-build .button-description').html(sButtonText);
}


/*
*	KO CORE:
*/
QCS.Controllers.Compile.fn = function(KOCore){
	this.KOCore 	= KOCore;
	this.Initialize = QCS.Controllers.Compile.Initialize;
	this.Build 		= QCS.Controllers.Compile.Build;
	this.BuildError = QCS.Controllers.Compile.BuildError;
	this.BuildSuccess = QCS.Controllers.Compile.BuildSuccess;
	this.SetButtonState = QCS.Controllers.Compile.SetButtonState;

	this.Initialize();
}