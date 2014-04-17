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

QCS.Controllers.Backtests = [];
QCS.Controllers.Backtests.self = {};

/*
*	Open a Backtest
*/
QCS.Controllers.Backtests.OpenBacktest = function( oBacktest ){

	console.log("Opening :", oBacktest.sName() );

	// See if the backtest is already open
	if( $('.primary-tab-header a[href="#'+oBacktest.backtestTabId()+'"]').length > 0 )
	{
		console.log("Backtest already open");
		// if is open just show it
		QCS.Controllers.Backtests.SetActiveTab( oBacktest.backtestTabId() );
		return;
	}

	self = this;

	// Check if the data was already downloaded
	if( typeof oBacktest.oResultData.equity === "undefined" )
	{
		if( oBacktest.sStatus() == "Completed." ){

			console.log(" Downloading backtest data. ");
			
			$.growl.notice({ title:"", message: "Downloading Backtest data..." });

			$.getJSON("/terminal/processSimulatorResults/get/"+oBacktest.sSimulationID() , function(jnBacktests) {
					if( jnBacktests !== null )
					{
						var oBactestResult = jnBacktests.oResultData;

						oBacktest.SetResultData(oBactestResult);

						// Open the Result tab once the data is ready
						console.log("Data downloaded opening tab");

						self.KOCore.Views.ResultTab.OpenBacktest( oBacktest );

						$.wait(function(){
							QCS.Controllers.Backtests.SetActiveTab( oBacktest.backtestTabId() );
							QCS.Controllers.Backtests.DeferLoadTab( oBacktest );
					    }, 10 );
					}
				});
		}
		else{
			console.log( "Backtest runing, waiting to the first package arrives" );
		}
	}
	else{

		console.log("Data already downloaded");

		self.KOCore.Views.ResultTab.data.push(oBacktest);
		// Open the Result tab because the data is already downloaded
		$.wait(function(){
			QCS.Controllers.Backtests.SetActiveTab( oBacktest.backtestTabId() );
			QCS.Controllers.Backtests.DeferLoadTab(oBacktest);
	    }, 10 );
	}
};


/*
*	Load the logs of the backtest.
*/
QCS.Controllers.Backtests.LoadLogs = function( oBacktest ){

	console.log("Downloading logs");

	if( oBacktest.oResultData.logs() == "Downloading Logs..." )
	{
		console.log("Downloading the result data");
		$.get("/terminal/processLoadLog/"+oBacktest.sSimulationID() , function( sLogs ) {
				if( sLogs !== "" )
				{
					oBacktest.oResultData.logs(sLogs);
				}
			});
	}
};


/*
*	Load the backtest tab later.
*/
QCS.Controllers.Backtests.DeferLoadTab = function(oBacktest){
	$.wait(function(){ QCS.Controllers.Chart.LoadChart( oBacktest ) }, 50 );
};

/*
*	Set the active tab:
*/
QCS.Controllers.Backtests.SetActiveTab = function( sID ){
	var self = QCS.Controllers.Backtests.self;
	self.KOCore.Controllers.Tabs.SetActive('primary-tab-header',sID);
}


/*
*	Delete a backtest:
*/
QCS.Controllers.Backtests.DeleteBacktest = function(oBacktest) {

	bootbox.confirm("Are you sure you want to delete this backtest? "+oBacktest.sName(), function(decision) {
		if (decision) {
			var oPackage = { root:[ {sSimulationID:oBacktest.sSimulationID() }] };
			var iProjectID = QCS.Controllers.Projects.iProjectID;

			$.growl.notice({title:"Loading...", message: "Removing Backtest." });

			$.ajax({
				type: "POST",
				url: "/terminal/processSimulatorResults/destroy/"+iProjectID,
				async: true,
				data:  JSON.stringify(oPackage),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function(data){
					console.log(data);
					// Remove from the active tabs.
					self.KOCore.Views.ResultTab.CloseTab(oBacktest);
					// Remove from the model files.
					self.KOCore.Models.Backtests.Remove(oBacktest);
					
					$.growl.success({ message: "Backtest removed successfully." });
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



QCS.Controllers.Backtests.fn = function(KOCore){
	this.KOCore = KOCore;
	QCS.Controllers.Backtests.self = this;
	// by default the current project id its null
	this.OpenBacktest = QCS.Controllers.Backtests.OpenBacktest;
	this.SetActiveTab = QCS.Controllers.Backtests.SetActiveTab;
	this.DeferLoadTab = QCS.Controllers.Backtests.DeferLoadTab;
	this.DeleteBacktest = QCS.Controllers.Backtests.DeleteBacktest;
	this.OpenBacktest = QCS.Controllers.Backtests.OpenBacktest;
	this.LoadLogs 	  = QCS.Controllers.Backtests.LoadLogs;
};