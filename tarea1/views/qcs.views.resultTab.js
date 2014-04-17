/*
 *	This file have all the declaration of QC.views.resultTab
 *
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

QCS.Views.ResultTab = [];

/*
*	Class Variables:
*/
QCS.Views.ResultTab.self = null;


/*
*	Open the backtest:
*/
QCS.Views.ResultTab.OpenBacktest = function(oBacktest) {
	//Insert the new data:
	QCS.Views.ResultTab.self.data.push(oBacktest);
	//Trigger a refresh of the tab-repo calculation.
	QCS.Views.Tabs.RefreshTabScroll();
}


/*
*	KO CORE:
*/
QCS.Views.ResultTab.fn = function(KOCore){

	//Initialize the view:
	this.KOCore = KOCore;
	var self = this;
	self.data = ko.observableArray([]);
	QCS.Views.ResultTab.self = self;

	//Functions:
	this.OpenBacktest = QCS.Views.ResultTab.OpenBacktest;


	//Inline Functions:

	/*
	*	Get the backtest data:
	*/
	this.GetAll = function(){
		return self.data;
    }

    /*
    *	Remove all the result tabs:
    */
	this.RemoveAll = function(){
		this.data.removeAll();
	}

	/*
	*	Close the result tab:
	*/
    this.CloseTab = function( oBacktest ){
		// remove the object chart
		oBacktest.oChart = null;
		// Preserve active tab
		$('.primary-tab-header a[href="#'+oBacktest.backtestTabId()+'"]').parent().preserveActiveTab();
		self.data.remove(oBacktest);
		//Trigger a refresh of the tab-repo calculation.
        QCS.Views.Tabs.RefreshTabScroll();
	}
};

