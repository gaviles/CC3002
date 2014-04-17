/*
 *	Live Mode Controller
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

QCS.Controllers.Live = [];

QCS.Controllers.Live.self = {};


/*
*	QCS.Controllers.Live.ToggleMode
*/
QCS.Controllers.Live.Initialize = function() {

	var self = QCS.Controllers.Live.self;
	console.log("Activating Live Mode");
}



/*
*	QCS.Controllers.Live.ToggleMode
*/
QCS.Controllers.Live.ToggleMode = function() {

	var toggle = $('#switch-terminal-mode');
	var state = toggle.prop('checked');
	var self = QCS.Controllers.Live.self;

	//Set state to inverted:
	toggle.prop('checked', !state);

	if (!state) {
		$('body').addClass("live");
		$('body').removeClass("backtest");
		self.setLive();
	} else {
		$('body').removeClass("live");
		$('body').addClass("backtest");
		self.setBacktest();
	}
}

/*
*	QCS.Controllers.Live.setLive()
*/
QCS.Controllers.Live.setLive = function(){
	var self = QCS.Controllers.Live.self;

	console.log("Activating Live Mode");
	self.isLive(true);
	self.VerifyProject();
	// Force to show the feed 
	self.KOCore.Controllers.Feed.show();
}

/*
*	QCS.Controllers.Live.setBacktest()
*/
QCS.Controllers.Live.setBacktest = function(){
	var self = QCS.Controllers.Live.self;

	console.log("Activating Backtest Mode");
	self.isLive(false);
	self.VerifyProject();
	// Force to show the feed 
	self.KOCore.Controllers.Feed.show();
}

QCS.Controllers.Live.VerifyProject = function(){
	var self = QCS.Controllers.Live.self;

	if( QCS.Controllers.Projects.iProjectID !== null ){

		var oProject = self.KOCore.Controllers.Projects.OpenProject();
		self.KOCore.Controllers.Projects.Close();
		self.KOCore.Controllers.Projects.SetProject(oProject);
		// hide welcome tab
		self.KOCore.Views.WelcomeTab.Hide();
	}else{
		self.KOCore.Views.WelcomeTab.Show();
	}
}


/*
*	KO Core
*/
QCS.Controllers.Live.fn = function(KOCore){
	this.KOCore = KOCore;
	QCS.Controllers.Live.self = this;

	this.isLive = ko.observable(false);

	this.Initialize	 	= QCS.Controllers.Live.Initialize;
	this.ToggleMode	 	= QCS.Controllers.Live.ToggleMode;
	this.setLive	 	= QCS.Controllers.Live.setLive;
	this.setBacktest 	= QCS.Controllers.Live.setBacktest;
	this.VerifyProject 	= QCS.Controllers.Live.VerifyProject;
	this.Initialize();
};