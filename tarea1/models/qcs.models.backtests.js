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

QCS.Models.Backtests = [];

/*
*	Define Class Variables:
*/
QCS.Models.Backtests.self = null;




// Models
function Statistic(sName,Value){
	this.sName = ko.observable(sName);
	this.value = ko.observable(Value);
};

function Backtest(data) {
    this.sSimulationID = ko.observable(data.sSimulationID);
    this.dProgress = ko.observable(data.dProgress);
	this.dtRequested = ko.observable(data.dtRequested);

	// oResult object tree
	this.oResultData = [];
	this.oResultData.statistics = ko.observableArray([]);
	this.oResultData.iVersion = ko.observable(0);
	this.oResultData.orders = ko.observableArray([]);
	this.oResultData.performance = ko.observableArray([]);
	this.oResultData.logs = ko.observable("Downloading Logs...");

	this.sName = ko.observable(data.sName);
	this.iProjectID = ko.observable(data.iProjectID);
	this.id = ko.observable(data.id);
	this.dtStartDate = ko.observable(data.dtStartDate);
	this.dtEndDate = ko.observable(data.dtEndDate);
	this.iTradeableDates = ko.observable( parseInt(data.iTradeableDates) );
	this.sRunMode = ko.observable(data.sRunMode);
	this.bOpened = ko.observable(data.bOpened);
	this.sStatus = ko.observable(data.sStatus);
	this.ePrivacy = ko.observable(data.ePrivacy);
	this.sKey = ko.observable(data.sKey);
	this.iVersion = ko.observable( parseInt(data.iVersion) );
	this.sLog = ko.observable(data.sLog);
	this.sSparkline = ko.observable(data.sSparkline);


	this.SetResultData = function(jnResultData){

		if(this.sStatus() == "Completed." ){

			var oResultData = $.parseJSON(jnResultData);

			if( oResultData !== null ) {
				// parse the components of the result data object
				this.oResultData.equity = $.parseJSON(oResultData.equity);
				this.oResultData.iVersion( $.parseJSON(oResultData.iVersion) );
				this.oResultData.orders( $.parseJSON(oResultData.orders) );
				this.oResultData.performance( $.parseJSON(oResultData.performance) );
				this.oResultData.statistics( this.SetStatistics( $.parseJSON(oResultData.statistics).Overall ) );

				// Finally replace in to the main model.
				//this.oResultData = oResultData;
				console.log(this.oResultData);
				console.log(this.oResultData.orders);
			}
		}
	};

	this.SetStatistics = function( oStatistics ){

		var aStatistics = [];

		for(var i in  oStatistics )
		{
			aStatistics.push( {sName:i,value:oStatistics[i]}  );
		}
		console.log(aStatistics);
		return aStatistics;
	}

	this.sparklineHtmlId = ko.computed(function() {
        return 'sparkline-'+this.sSimulationID().replace(/\s/g, '');
    }, this);

    this.pProgress = ko.computed(function() {
        return Math.round(this.dProgress()*100) + "%";
    }, this);

	this.backtestTabId = ko.computed(function() {
        return 'backtest-tab-'+this.sSimulationID().replace(/\s/g, '');
    }, this);

    this.backtestChartId = ko.computed(function() {
        return 'backtest-chart-'+this.sSimulationID().replace(/\s/g, '');
    }, this);

    this.oChart = null;
}



/*
*	Insert the first backtest with the name:
*/
QCS.Models.Backtests.InsertFirst = function(sName, sSimulationID, iProjectID) {

	var self = QCS.Models.Backtests.self;

	var oBacktest = new Backtest({
		sSimulationID : sSimulationID,
		dProgress : '0',
		dtRequested : '',
		oResultData : [],
		sName : sName,
		iProjectID : iProjectID,
		id : null,
		dtStartDate : '',
		dtEndDate : '',
		iTradeableDates : 0,
		sRunMode : '',
		bOpened : false,
		sStatus : 'In Queue...',
		ePrivacy : 'private',
		sKey : '',
		iVersion : '1.0',
		sLog : '',
		sSparkline : ''
	});

	//Insert it:
	self.data.unshift(oBacktest);
	//Once the new object is created, open the result view:
	self.KOCore.Controllers.Backtests.OpenBacktest(oBacktest);

	$.growl.notice({ title:"", message: "New Backtest: "+sName+", is in the queue." });
}


/*
*	Insert a new data packet into the QCS Dynamic Chart
*/
QCS.Models.Backtests.Update = function(sSimulationID, lSimulationData, oResultData) {

	console.log("Insert new packet to backtest model: ", sSimulationID, lSimulationData, oResultData);

	var match = false;
	var self = QCS.Models.Backtests.self;
	var aBacktests = self.data();
	// update the data in the models backtest
	//Go through the data, seek he simulation id:
	for(var i = 0; i < aBacktests.length; i++) {
		if (aBacktests[i].sSimulationID() == sSimulationID) {

			console.log("Matching simulationId found. Updating the data:");


			// parse the components of the result data object
			if (lSimulationData.dProgress == "1.00") {

				console.log("last package receive");

				QCS.Controllers.Chart.UpdateChart( 	aBacktests[i].oChart,
									oResultData.equity,
									new Date( aBacktests[i].dtStartDate() ),
									new Date( aBacktests[i].dtEndDate() ) );

				// get the simulation sparkline, then finish the process
				$.getJSON("/terminal/processSparkline/"+sSimulationID, function(jnSparkline) {

					console.log("Sparkline process response", jnSparkline );
			    	if( jnSparkline !== null ){
			    		if( jnSparkline.success == true ){
			    			aBacktests[i].sSparkline(jnSparkline.sparkline);
			    			self.UpdateBacktest(aBacktests[i], 'Completed.', sSimulationID, lSimulationData, oResultData);
			    		}
					}
			    });

			} else {

				if( typeof aBacktests[i].oResultData.equity === "undefined" ){

					console.log(" Inserting data for first time ");

					self.KOCore.Views.ResultTab.OpenBacktest(aBacktests[i]);

					self.UpdateBacktest(aBacktests[i], 'Running...', sSimulationID, lSimulationData, oResultData);

					$.wait(function(){
						QCS.Controllers.Backtests.SetActiveTab( aBacktests[i].backtestTabId() );
						QCS.Controllers.Backtests.DeferLoadTab( aBacktests[i] );
				    }, 10 );

				}else{
					/*
					 * 	The backtest result already exist, then add the data to the chart
					 */

					 console.log(" pushing data to the data array ");

					// Secibd check if the oChart exist
					if( aBacktests[i].oChart !== null ){

						QCS.Controllers.Chart.UpdateChart( 	aBacktests[i].oChart,
															oResultData.equity,
															new Date( aBacktests[i].dtStartDate() ),
															new Date( aBacktests[i].dtEndDate() ) );
					}
				}

				self.UpdateBacktest(aBacktests[i], 'Running...', sSimulationID, lSimulationData, oResultData);
			}
			break;
		}
	}
}


/*
*	Search and update the data from a Backtest array
*/

QCS.Models.Backtests.UpdateBacktest = function( oBacktest, sStatus, sSimulationID, lSimulationData, oResultData  ){

	oBacktest.dtEndDate(lSimulationData.dtEndDate);
	oBacktest.sRunMode(lSimulationData.sRunMode);
	oBacktest.dtRequested(lSimulationData.dtRequested);
	oBacktest.dtStartDate(lSimulationData.dtStartDate);
	oBacktest.oResultData.equity = $.parseJSON(oResultData.equity);
	oBacktest.oResultData.performance( $.parseJSON(oResultData.performance) );
	oBacktest.dProgress(lSimulationData.dProgress);
	oBacktest.iTradeableDates(lSimulationData.iTradeableDates);

	// parse the components of the result data object
	if (sStatus == 'Completed.') {
		oBacktest.oResultData.statistics( oBacktest.SetStatistics( $.parseJSON(oResultData.statistics).Overall ) );
		oBacktest.oResultData.orders( QCS.Models.Backtests.ArrayParse( 	$.parseJSON(oResultData.orders,
																		new Array() ) ) );
	}else{

		oBacktest.oResultData.orders( QCS.Models.Backtests.ArrayParse( 	$.parseJSON(oResultData.orders),
																		oBacktest.oResultData.orders() ) );
	}

	console.log( "orders" , oBacktest.oResultData.orders );

	oBacktest.sStatus(sStatus);
}

/*
 *	Parse the order object of objects into an array of objects
 */
QCS.Models.Backtests.ArrayParse = function( oOrders, rOrders ){

	if( typeof rOrders === "undefined" ){
		rOrders = [];
	}

	for(var i in oOrders ){
        if( rOrders.length > 0 ){
        	if( rOrders[rOrders.length -1].id < oOrders[i].id ){

        		rOrders.push(oOrders[i]);
        	}
        }else{

			rOrders.push( oOrders[i] );
        }
	}
	return rOrders;
}

/*
 *	Parse the order object of objects into an array of objects
 */



/*
*	Remove this backtest from the Models.
*/
QCS.Models.Backtests.Remove = function( oBacktest ) {
	var self = QCS.Models.Backtests.self;
	self.data.remove(oBacktest);
	QCS.Views.Tabs.RefreshTabScroll();
}


/*
*	KO CORE STORE:
*/
QCS.Models.Backtests.fn = function(KOCore){
    // Data
    this.KOCore = KOCore;
    this.data = ko.observableArray([]);
	var self = this;
	QCS.Models.Backtests.self = self;

    //Define Functions
    this.InsertFirst = QCS.Models.Backtests.InsertFirst;
    this.Update = QCS.Models.Backtests.Update;
    this.Remove = QCS.Models.Backtests.Remove;
    this.UpdateBacktest = QCS.Models.Backtests.UpdateBacktest;
    this.setChartPosition = QCS.Models.Backtests.setChartPosition;

	this.GetAll = function(){
		return this.data;
    };

    this.RemoveAll = function(){
    	this.data.removeAll();
    }

    // Requires the project id
    this.GetBacktests = function( iPID ) {

		self = QCS.Models.Backtests.self;
		console.log("Loading Backtest of "+iPID+" project");

	    $.getJSON("/terminal/processSimulatorResults/read/" + iPID, function(jnBacktests) {
	    	if( jnBacktests !== null )
	    	{
				var aBacktest = jnBacktests.root;
				if(typeof aBacktest !== "undefined" )
				{
		        	var mappedBacktests = $.map(aBacktest, function(item) { return new Backtest(item) });
		        	self.data(mappedBacktests);
				}
			}
	    });
    }
}