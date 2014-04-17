/*
 *	Main js file, inicializes the IDE
 *
 */

/********** Test Function *********
 *
 * This function will thest the functions
 *
 */

/**
 *
 * @access public
 * @return void
 **/
function globalQCScroll(){
	//Init pretty scrollbars
	$('.scroll').perfectScrollbar({
		wheelSpeed: 20,
		wheelPropagation: false,
		suppressScrollX: true,
		useKeyboard: false
	});
}


window.onload = function(){
	//QCS.Controllers.Chart.Ini();
	ko.applyBindings(QcsViewModel);

    //Disable the buttons:
    QCS.Controllers.Compile.SetButtonState(false, 'Build');
	QCS.Controllers.Simulate.SetButtonState(false, 'Backtest');

	//Initialize the API:
    qc.api.init(window.iUserID);
    qc.api.setSessionID(window.sSessionID);
    qc.api.setProject(0);

	//ASYNC Connection Success
	qc.api.setHandler('SubscribeSuccess',function() {
	   console.log('API Connection Success...');
	   QCS.Controllers.Simulate.SetButtonState(true);
	   QCS.Controllers.Compile.SetButtonState(true);
	});

	//Compile Error Handler:
	qc.api.setHandler("BuildError", function(aProperties, aErrors) {
	   QCS.Controllers.Compile.BuildError(aProperties, aErrors);
	});

	//Successful Build: Return Build iD , Unlock simulator.
	qc.api.setHandler("BuildSuccess", function(cBuildData) {
	   QCS.Controllers.Compile.BuildSuccess(cBuildData);
	});

	//Simulation result packets:
    qc.api.setHandler("SimulationResult", function(sSimulationID, lSimulationData, oSimulationResult) {
        QCS.Controllers.Simulate.SimulationResult(sSimulationID, lSimulationData, oSimulationResult);
    });

    //Code error like a divide by zero.
    qc.api.setHandler("RuntimeError", function(sMessage) {
    	QCS.Controllers.Simulate.RuntimeError(sMessage);
    });

    //Send the console debug messages
    qc.api.setHandler("Debug", function(oData) {
        QCS.Views.Console.AddText(oData.sValue);
    });

    //Error in simulation.
    qc.api.setHandler("SimulationError", function(sSimulationID, sMessage) {
    	QCS.Controllers.Simulate.SimulationError(sSimulationID, sMessage);
    });

    globalQCScroll();

	//Init the menu hider button
	$('body').on('click', '.menu-compress-close, #menu-compressed', function(e) {
		$('body').toggleClass('menu-compressed');
		e.preventDefault();
	});

	//Hide menu on load if its a small screen.
	if ($(window).width() < 1200) {
		$('body').addClass('menu-compressed');
	}

	//Hide the loading div.
	$('.body-container').css('left', '0');
	$('.body-container').css('position', 'inherit');
	$('.body-loading').css('display', 'none');

	console.log("QC IDE v2.0 Loaded.");
	$.wait(function() {QCS.Controllers.Chart.CreateSparklines();}, 250);
};

QcsViewModel = {};

QcsViewModel.Models = {
	Groups 		: new QCS.Models.Groups(QcsViewModel),
	Projects 	: new QCS.Models.Projects.fn(QcsViewModel),
	Files 		: new QCS.Models.Files.fn(QcsViewModel),
	Backtests 	: new QCS.Models.Backtests.fn(QcsViewModel),
	Feed	 	: new QCS.Models.Feed.fn(QcsViewModel),
	Popular	 	: new QCS.Models.Popular.fn(QcsViewModel)
};

QcsViewModel.Views = {
	ResultTab 	: new QCS.Views.ResultTab.fn(QcsViewModel),
	CodeTab		: new QCS.Views.CodeTab.fn(QcsViewModel),
	Console		: new QCS.Views.Console.fn(QcsViewModel),
	LoadingTab	: new QCS.Views.LoadingTab.fn(QcsViewModel),
	WelcomeTab	: new QCS.Views.WelcomeTab.fn(QcsViewModel),
	Feed		: new QCS.Views.Feed.fn(QcsViewModel),
	Popular		: new QCS.Views.Popular.fn(QcsViewModel),
	Tabs		: new QCS.Views.Tabs.fn(QcsViewModel)
};

QcsViewModel.Controllers = {
	Chart 		: new QCS.Controllers.Chart.fn(QcsViewModel),
	Projects 	: new QCS.Controllers.Projects.fn(QcsViewModel),
	Backtests 	: new QCS.Controllers.Backtests.fn(QcsViewModel),
	Feed		: new QCS.Controllers.Feed.fn(QcsViewModel),
	Tabs		: new QCS.Controllers.Tabs.fn(QcsViewModel),
	Compile		: new QCS.Controllers.Compile.fn(QcsViewModel),
	Simulate	: new QCS.Controllers.Simulate.fn(QcsViewModel),
	Modals		: new QCS.Controllers.Modals.fn(QcsViewModel),
	Resize		: new QCS.Controllers.Resize.fn(QcsViewModel),
	Git			: new QCS.Controllers.Git.fn(QcsViewModel),
	Popular		: new QCS.Controllers.Popular.fn(QcsViewModel),
	Files		: new QCS.Controllers.Files.fn(QcsViewModel),
	Navigator	: new QCS.Controllers.Navigator.fn(QcsViewModel),
	SignUp		: new QCS.Controllers.SignUp.fn(QcsViewModel),
	Live		: new QCS.Controllers.Live.fn(QcsViewModel)
};

// Remove later
QcsViewModel.Test = {
	//Console		: new ConsoleTest(QcsViewModel)

};

//Event called after the rendering of template, but items may not be visible yet.
QcsViewModel.PostRenderHandler = function(e) {


};