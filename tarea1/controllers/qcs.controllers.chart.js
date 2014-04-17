/*
 *	This file have all the declaration of QC.controllers.chart
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

QCS.Controllers.Chart = [];

QCS.Controllers.Chart.Initialize = function(){

	// load the chart iq resurces.
	QCS.Controllers.Chart.LoadResources();

	// Ini the smar resize
	var self = this;

	$(window).smartresize(function(e){
    	self.KOCore.Controllers.Chart.Resize();
	});

	//Show the sparklines when the bootstrap tabs are shown
	$('ul.nav a').on('shown.bs.tab', function (e) {
	   	$.sparkline_display_visible();
	});
}

// The resorces of the chart iq

QCS.Controllers.Chart.aResources = [
	{src:'js/libraries/stxModulus.js',b:true},
	{src:'js/libraries/stxChart.js',b:false},
	{src:'js/libraries/stxDrawing.js',b:true},
	{src:'js/libraries/stxUI.js',b:true},
	{src:'js/libraries/stxKernelOs.js',b:true}
];


// Load the resources of the chart iq

QCS.Controllers.Chart.LoadResource = function(src, bCharSet, callback){
	var iTimeStamp = new Date().getTime();
	var oScript = document.createElement('script');
	oScript.setAttribute("type","text/javascript");
	if(bCharSet) oScript.setAttribute("charset","ISO-8859-1");
	oScript.setAttribute("onload",callback);
	oScript.setAttribute("src", src+"?_"+iTimeStamp);
	document.getElementsByTagName("head")[0].appendChild(oScript);
};

QCS.Controllers.Chart.LoadResources = function(){
	if(QCS.Controllers.Chart.aResources.length > 0 ) {
	    var oResource = QCS.Controllers.Chart.aResources.shift();
	    QCS.Controllers.Chart.LoadResource(oResource.src,oResource.b,"QCS.Controllers.Chart.LoadResources();");
	} else {
	    if(typeof STXStudies.studyLibrary.qcsPanel == "undefined") {
	        console.log('ini the panel v2');
	        var qcsCallback = QCS.Controllers.Chart.PanelCallback;
	        STXStudies.studyLibrary.qcsPanel={
	            "calculateFN": qcsCallback,
	            "outputs":{"Result":"auto"}
	        };
	    }
	}
};

QCS.Controllers.Chart.ProcessData = function(samples, stx){

	var sInterval = stx.layout.interval;
	var bIsDaily = ( sInterval == "day" );
	var bIsWeekly = ( sInterval == "week" );
	var bIsMonthly =( sInterval == "month" );

	// Iterate through sample data set. Create blank entries to cover gaps.
	// Find the initial tick, will set to start of day or start of hour prior to the first tick depending
	// on how small the interval is

	var dt = new Date( samples[0].x );
	dt.setMilliseconds(0);
	dt.setSeconds(0);
	dt.setMinutes(0);

	if( bIsDaily || sInterval > 15)
	{
	    dt.setHours(0);
	}

	var dataSet=[];
	var i=0;

	// Stop at 100,000 just in case of an error in the sample
	for( var j=0 ; j < samples.length ; j++ )
	{
	    var obj={
	        Date: yyyymmddhhmm(dt),
	        DT: dt
	    };

	    dataSet.push(obj);

	    // Advance through samples until one is in the future
	    while(i<samples.length)
	    {
	        var updateObj;
	        if( samples[i].x==dt.getTime() )
	        {
	            updateObj=dataSet[dataSet.length-1];
	        }
	        else if(samples[i].x<=dt.getTime())
	        {
	            // Put the data in the previous entry (since we're past the sample time)
	            updateObj=dataSet[dataSet.length-2];
	        }
	        else
	        {
	            break;
	        }
	        updateObj.Close=samples[i].y;
	        if(!("Scatter" in updateObj))
	        {
	            updateObj.Scatter=[];
	            updateObj.Open=updateObj.Close;
	            updateObj.High=updateObj.Close;
	            updateObj.Low=updateObj.Close;
	        }
	        else
	        {
	            if(updateObj.Close>updateObj.High)
	            {
	                updateObj.High=updateObj.Close;
	            }
	            else if(updateObj.Close<updateObj.Low)
	            {
	                updateObj.Low=updateObj.Close;
	            }
	        }
	        updateObj.Scatter.push(updateObj.Close);
	        i++;
	    }
	    if(i>=samples.length)
	    {
	        break;
	    }
	    if(bIsDaily)
	    {
	        if(bIsWeekly)
	        {
	            dt=STXMarket.nextWeek(dt, 1, stx);
	        }
	        else if(bIsMonthly)
	        {
	            dt=STXMarket.nextMonth(dt, 1, stx);
	        }
	        else
	        {
	            dt=STXMarket.nextDay(dt, 1, stx);
	        }
	    }
	    else
	    {
	        dt=STXMarket.nextPeriod(dt, sInterval, 1, stx);
	    }
	}

	// if last one doesn't have a close then we overshot
	if(!("Close" in dataSet[dataSet.length-1]))
	{
	    dataSet.pop();
	}
	return dataSet;
};

QCS.Controllers.Chart.PanelCallback = function(stx, sd){
	console.log('panel callback v3', sd.inputs.panel);

	// change the diplay name
	stx.panels[sd.name].display = sd.inputs.panel;

	// Get the tab of the panel
	var tab = QCS.Tabs.items.getByKey(sd.inputs.TabId);

	// Get the panel data
	if(typeof tab !== "undefined" && tab !== null)
	{
	    var oData = tab.aCustomCharts[sd.inputs.panel];

	    var field="Result " + sd.name;

	    for( var x = 0 ; x < stx.chart.scrubbed.length ; x++ )
	    {

	        if( x < oData.ChartIndex )
	        {
	            stx.chart.scrubbed[x][field] =  oData.DataPoints[x];
	        }
	        else
	        {
	            var iXDate = stx.chart.scrubbed[x].DT.getTime();

	            // Run over the Data points searching for the point more close the the iXDate
	            var iDiff = Math.abs(iXDate-oData.data[oData.DataIndex].x);
	            for( var i = oData.DataIndex + 1 ; i < oData.data.length ; i++ )
	            {
	                var iNewDiff = Math.abs(iXDate-oData.data[i].x);
	                if( iNewDiff > iDiff )
	                {
	                    oData.DataIndex = i-1;
	                    oData.ChartIndex = x;
	                    stx.chart.scrubbed[x][field] =  oData.data[oData.DataIndex].y;
	                    oData.DataPoints[x] = oData.data[oData.DataIndex].y;
	                    break;
	                }
	                else
	                {
	                    iDiff = iNewDiff;
	                }
	            }
	        }
	    }
	}
	else
	{
	    console.log('ERROR: Tab not defined',sd.inputs.TabId);
	}
};

QCS.Controllers.Chart.CreateChartShareMenu = function(sNewID){
	// Append the basic html
	var sMainContainerDom = sNewID+'-share-backtest';
	$('#'+sNewID).append(
	    '<div id="'+sMainContainerDom+'" class="shareBacktest" >'+
	        'SHARE THIS'+
	    '</div>'
	);

	// Add the listener to show the menu on clic
	// On click to community

	var oContainer = document.getElementById(sMainContainerDom);

	oContainer.onclick = function(){
	    var tab = QCS.Tabs.getActiveTab();
	    if(tab.tabType == "result" )
	    {
	        var newForm = jQuery('<form>', {
	            'action': '/forum/post/discussion/',
	            'target': '_blank',
	            'method' : 'post',
	            'id': Ext.id()
	        }).append(jQuery('<input>', {
	            'name': 'sAction',
	            'value': 'result',
	            'type': 'hidden'
	        })).append(jQuery('<input>', {
	            'name': 'ePermission',
	            'value': 'resultOnly',
	            'type': 'hidden'
	        })).append(jQuery('<input>', {
	            'name': 'sSimulationID',
	            'value': tab.oRecord.get('sSimulationID'),
	            'type': 'hidden'
	        })).append(jQuery('<input>', {
	            'name': 'sGroupName',
	            'value': 'Community',
	            'type': 'hidden'
	        })).append(jQuery('<input>', {
	            'name': 'iProjectID',
	            'value': QCS.iProjectID,
	            'type': 'hidden'
	        }));
	        newForm.submit();
	    }
	};
	return oContainer;
};


/*
*	Show the spark charts that were hidden
*/
QCS.Controllers.Chart.RefreshSparkVisibility = function() {
	$.wait(function() {
		$.sparkline_display_visible();
	}, 25);
}


QCS.Controllers.Chart.CreateSparklines = function() {
	$.wait(function() {
		//Create the sparks canvas
		$(".sparkline").each(function(i) {
			$(this).sparkline('html', {
				type: 'line',
				lineColor: '#1e79a7',
				maxSpotColor:'',
				height: Math.round($(this).height() - 2) + 'px',
				width: Math.round($(this).width() - 2) + 'px',
				minSpotColor:'',
				fillColor: false,
				highlightSpotColor: null,
				highlightLineColor: null,
				spotColor: ''
			});
			$(this).removeClass('sparkline');
			$(this).addClass('sparkline-rendered');
			$(this).css('width', '100%');
			$(this).css('min-width', '100px');
		});
	}, 50);
};

QCS.Controllers.Chart.SetSize = function( oBacktest ){

	// get the container tab
	var iHeight = $("#"+oBacktest.backtestChartId() ).height();
	var iWidth = $("#"+oBacktest.backtestChartId() ).width();

	console.log("Chart Width and Height",iWidth, iHeight);

	$('#' + oBacktest.backtestChartId() + "-contents").css('width',iWidth+'px');
    $('#' + oBacktest.backtestChartId() + "-contents").css('height',iHeight+'px');

	oBacktest.oChart.resizeChart();
};


// Handle the resize event in the chart, with debouncing.
QCS.Controllers.Chart.Resize = function(sID) {
	if (typeof sID == 'undefined') {
		sID = $('.result-tab .result-tab-chart').first().attr('id');
	}

	// get the container tab
	var iHeight = $( "#" + sID ).height();
	var iWidth = $( "#" + sID ).width();

	$('#' + sID + "-contents").css('width',iWidth+'px');
    $('#' + sID + "-contents").css('height',iHeight+'px');

    var aOpenedBacktests = this.KOCore.Views.ResultTab.data();
    if (aOpenedBacktests.length > 0) {
    	for(var i = 0; i < aOpenedBacktests.length; i++) {
    		aOpenedBacktests[i].oChart.resizeChart();

    		// Show all the chart
    		this.ShowAll( aOpenedBacktests[i] );
    	}
    }
}

// Show Full Chart Data Range
QCS.Controllers.Chart.ShowAll = function( oBacktest ){
	oBacktest.oChart.setRange(
		oBacktest.oChart.chart.dataSet[0].DT,
        oBacktest.oChart.chart.dataSet[oBacktest.oChart.chart.dataSet.length-1].DT,
        0
    );
    oBacktest.oChart.draw();
};




QCS.Controllers.Chart.LoadChart = function(oBacktest){

	console.log( "Load tab" , oBacktest.oChart );

	// check if the chart was already loaded
	if( oBacktest.oChart !== null )
	{
		// end
		return;
	}


	// Get the chart template
	var templateHTML = $('.chartTemplate').html();
	templateHTML = templateHTML.replace('chartid', oBacktest.backtestChartId()+"-contents");

	// Paste the template in to the chart div
	$( '#'+oBacktest.backtestChartId() ).html(templateHTML);

	oBacktest.oChart = new STXChart();
	oBacktest.oChart.chart.allowScrollPast=false;
	oBacktest.oChart.manageTouchAndMouse=true;

	if( oBacktest.sRunMode() == "Parallel" && oBacktest.sStatus() != "Completed."  )
	{
	    oBacktest.oChart.chart.symbol="Daily Performance";
	}
	else
	{
	    oBacktest.oChart.chart.symbol="Equity";
	}

	// 1000 = 4000 (max sample) / 4 (daily samples)

	console.log("iTradeableDates",oBacktest.iTradeableDates());

	if( oBacktest.iTradeableDates() > 1000 )
	{
	    // Set weekly candles (7 days)
	    oBacktest.oChart.layout.periodicity = 7;
	}

	console.log(" Pre process data ");
	var ProcessedData = QCS.Controllers.Chart.ProcessData( oBacktest.oResultData.equity , oBacktest.oChart );
	console.log(" Procesed data ");
	oBacktest.oChart.setMasterData( ProcessedData );
	oBacktest.oChart.createDataSet(true);
	console.log(" Pre ini chart ");
	oBacktest.oChart.initializeChart($$(oBacktest.backtestChartId()+"-contents"));
	console.log(" post ini chart ");
	oBacktest.oChart.setChartType("candle");
	console.log(" post set chart type ");

	// Fill the custom charts data
	//this.addCustomChartPoints(oResultData);

	QCS.Controllers.Chart.SetSize(oBacktest);

	if( oBacktest.sStatus() == "Completed." ){

		QCS.Controllers.Chart.ShowAll(oBacktest);

	}else{

		QCS.Controllers.Chart.setChartPosition( oBacktest.oChart,
												new Date( oBacktest.dtStartDate() ),
												new Date( oBacktest.dtEndDate() ) );
		oBacktest.oChart.draw();
	}
};

/*
*	Search and update the data from a Backtest array
*/
QCS.Controllers.Chart.setChartPosition = function(oChart, dtStartDate,  dtEndDate){

	console.log("Set Chart Position");

	oChart.setRange( oChart.chart.dataSet[0].DT , oChart.chart.dataSet[oChart.chart.dataSet.length-1].DT, 0);

	var iFactor = 86400000; // = (1000 * 3600 * 24);

	var iTotDays = Math.floor( ( dtEndDate.getTime()-dtStartDate.getTime()) / iFactor);
	var iProportionalRatio = (oChart.chart.dataSet[ oChart.chart.dataSet.length-1 ].DT-dtStartDate.getTime())/(oChart.chart.dataSet.length*iFactor);
	var iTotSpaces = Math.floor( iTotDays/iProportionalRatio );
	var iWidth = oChart.chart.width/iTotSpaces;

	oChart.layout.candleWidth = iWidth;

	oChart.chart.scroll = oChart.chart.dataSet.length;

	if( oChart.chart.scroll > oChart.chart.maxTicks )
	{
		oChart.chart.scroll = oChart.chart.maxTicks;
	}
}

/*
*	Inserts the new data in the chart then updates the chart position
*/
QCS.Controllers.Chart.UpdateChart = function( oChart, jnEquity, dtStartDate, dtEndDate ){

	var oProcessedData = QCS.Controllers.Chart.ProcessData( $.parseJSON( jnEquity ), oChart );

	console.log(" Data Procesed :", oProcessedData );

	oChart.appendMasterData( oProcessedData );

	QCS.Controllers.Chart.setChartPosition(	oChart, dtStartDate, dtEndDate );
							
	oChart.draw();
}



QCS.Controllers.Chart.fn = function(KOCore){

	this.KOCore 				= KOCore;
	this.LoadResource 			= QCS.Controllers.Chart.LoadResource;
	this.LoadResources 			= QCS.Controllers.Chart.LoadResources;
	this.ProcessData 			= QCS.Controllers.Chart.ProcessData;
	this.PanelCallback 			= QCS.Controllers.Chart.PanelCallback;
	this.CreateChartShareMenu 	= QCS.Controllers.Chart.CreateChartShareMenu;
	this.CreateSparkline		= QCS.Controllers.Chart.CreateSparklines;
	this.RefreshSparkVisibility	= QCS.Controllers.Chart.RefreshSparkVisibility;
	this.Initialize 			= QCS.Controllers.Chart.Initialize;
	this.LoadChart	 			= QCS.Controllers.Chart.LoadChart
	this.Resize 				= QCS.Controllers.Chart.Resize;
	this.ShowAll 				= QCS.Controllers.Chart.ShowAll;
	this.SetSize 				= QCS.Controllers.Chart.SetSize;
	this.setChartPosition 		= QCS.Controllers.Chart.setChartPosition;
	// execute the ini
	this.Initialize();
}

