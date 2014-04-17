/*
 *	This file have all the declaration of QC.Views.WelcomeTab
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

QCS.Views.WelcomeTab = [];

/*
*	Declare class variables:
*/
QCS.Views.WelcomeTab.self = null;

/*
*	Show the Welcome Tab
*/
QCS.Views.WelcomeTab.Show = function(){
	var self = QCS.Views.WelcomeTab.self;
	self.bShow(true);
	$.wait( function(){
		$('.primary-tab-header a[href="#welcome-tab"]').setActiveTab()
	}, 50);
}

/*
*	Hide the Welcome Tab
*/
QCS.Views.WelcomeTab.Hide = function() {
	var self = QCS.Views.WelcomeTab.self;
	self.bShow(false);
}

/*
*	KO Constructor
*/
QCS.Views.WelcomeTab.fn = function(KOCore){
	//Set References
	this.KOCore = KOCore;
	QCS.Views.WelcomeTab.self = this;

	//Define Variables
	this.bShow = ko.observable(true);

	//Define Methods:
	this.Show = QCS.Views.WelcomeTab.Show;
	this.Hide = QCS.Views.WelcomeTab.Hide;
};
