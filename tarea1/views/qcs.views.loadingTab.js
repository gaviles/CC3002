/*
 *	This file have all the declaration of QC.Views.LoadingTab
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

QCS.Views.LoadingTab = [];

/*
*	Declare Class Variables
*/
QCS.Views.LoadingTab.self = null;


/*
*	Show the Loading Tab
*/
QCS.Views.LoadingTab.Show = function(){
	var self = QCS.Views.LoadingTab.self;
	self.bShow(true);
	$.wait( function(){
		$('.primary-tab-header a[href="#loading-tab"]').setActiveTab()
	}, 50);
}

/*
*	Hide the Loading Tab
*/
QCS.Views.LoadingTab.Hide = function(){
	var self = QCS.Views.LoadingTab.self;
	self.bShow(false);
}


/*
*	KO Constructor
*/
QCS.Views.LoadingTab.fn = function(KOCore){
	//Set References
	this.KOCore = KOCore;
	QCS.Views.LoadingTab.self = this;

	//Define Variables
	this.bShow = ko.observable(false);

	//Define Methods:
	this.Show = QCS.Views.LoadingTab.Show;
	this.Hide = QCS.Views.LoadingTab.Hide;
};
