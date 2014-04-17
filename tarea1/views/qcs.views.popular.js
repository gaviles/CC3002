/*
 *	This file have all the declaration of QC.Views.Feed
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

QCS.Views.Popular = [];

/*
*	Class Variables:
*/
QCS.Views.Popular.self = null;


/*
*	Initialize the Popular Tab:
*/
QCS.Views.Popular.Initialize = function() {

	//Initialize:
	var self = QCS.Views.Popular.self

}

/*
*	KO CORE:
*/
QCS.Views.Popular.fn = function(KOCore){

	//Initialise:
	this.KOCore = KOCore;
	var self = this;
	QCS.Views.Popular.self = this;
	self.data = ko.observableArray([]);

	//Initialize the Functions
	this.Initialize = QCS.Views.Popular.Initialize;

	this.GetAll = function(){
		return self.data;
    };

    this.Initialize();
};

