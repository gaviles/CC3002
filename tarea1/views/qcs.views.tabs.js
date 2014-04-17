/*
 *	This file have all the declaration of QC.Views.Tabs
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

QCS.Views.Tabs = [];

/*
*	Class Variables:
*/
QCS.Views.Tabs.self = null;


/*
*	Initialize the Feed View:
*/
QCS.Views.Tabs.Initialize = function() {

	//Initialize the click handlers for the tab scrollers:
	//Click Left, call Left Handler:
	$('#tab-scroller i.left').click(function() {
		QCS.Views.Tabs.ScrollLeft();
	});

	//Click Right, call Right Handler:
	$('#tab-scroller i.right').click(function() {
		QCS.Views.Tabs.ScrollRight();
	});

	//WHen the repo resizes, update the visibility of the scrollers.
	$('#tab-repo').resize(function() {
		QCS.Views.Tabs.RefreshTabScroll();
	});
}


/*
*	Click on the scroll left button.
*/
QCS.Views.Tabs.ScrollLeft = function() {
	var self = QCS.Views.Tabs.self;
	if (!self.bDisabledLeft()) {
		var iMargin = self.iMargin();
		if (iMargin < -100) {
			iMargin += 100;
		} else {
			iMargin = 0;
		}
		self.iMargin(iMargin);
	}
	QCS.Views.Tabs.RefreshTabScroll();
}


/*
*	Click on the scroll right button.
*/
QCS.Views.Tabs.ScrollRight = function() {
	var self = QCS.Views.Tabs.self;
	if (!self.bDisabledRight()) {
		var iMargin = self.iMargin();
		iMargin -= 100;
		self.iMargin(iMargin);
	}
	QCS.Views.Tabs.RefreshTabScroll();
}


/*
*	Update the Tab Scroll
*/
QCS.Views.Tabs.RefreshTabScroll = function() {
	//Every time we add a new tab, refresh the scroller visibility and button states:
	$.wait( function(){
		var self = QCS.Views.Tabs.self;
		self._oRefreshObj.notifySubscribers();
	}, 5);
}


/*
*	Get the sum of the tabs width
*/
QCS.Views.Tabs.SumOfTabsWidth = function() {
	var iSumWidth = 0;
	$('#nav-tabs-files li').each(function(index) {
		iSumWidth += $(this).width();
	});
	return iSumWidth;
}



/*
*	KO CORE:
*/
QCS.Views.Tabs.fn = function(KOCore){

	//Initialise:
	this.KOCore = KOCore;
	var self = this;
	QCS.Views.Tabs.self = this;

	//Initialize the Functions
	this.Initialize = QCS.Views.Tabs.Initialize;
	this.ScrollLeft = QCS.Views.Tabs.ScrollLeft;
	this.ScrollRight = QCS.Views.Tabs.ScrollRight;
	this.RefreshTabScroll = QCS.Views.Tabs.RefreshTabScroll;
	this.SubOfTabsWidth = QCS.Views.Tabs.SubOfTabsWidth;


	//PX Margin Number:
	this.iMargin = ko.observable(0);
	this._oRefreshObj = ko.observable(0);

	//Scroller variables:
	this.bScrollerVisible = ko.computed(function() {
		this._oRefreshObj();
		var bVisible = $('#tab-repo').width() < QCS.Views.Tabs.SumOfTabsWidth();
		if (!bVisible) {
			this.iMargin(0);
			QCS.Views.Tabs.RefreshTabScroll();
		}
		return bVisible;
	}, this);

	//PX Margin:
	this.iTabScrollMargin = ko.computed(function() {
		this._oRefreshObj();
		return this.iMargin() + 'px';
	}, this);

	//Disable the left button when the margin is less than of == 0.
	this.bDisabledLeft = ko.computed(function() {
		this._oRefreshObj();
		return (this.iMargin() >= 0);
	}, this);

	//Disable the right button when the margin is more than the space required.
	this.bDisabledRight = ko.computed(function() {
		this._oRefreshObj();
		return (Math.abs(this.iMargin()) > ( QCS.Views.Tabs.SumOfTabsWidth() - $('#tab-repo').width()) );
	}, this);

	this.GetAll = function(){
		return self.data;
    };

    //Finally call initialize:
    this.Initialize();

};

