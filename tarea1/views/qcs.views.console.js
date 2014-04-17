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

QCS.Views.Console = [];

/*
*	Class Variables:
*/
QCS.Views.Console.self = null;


/*
*	Open the South Console:
*/
QCS.Views.Console.Open = function() {
	$('body').addClass("footer-opened");
}


/*
*	Open the South Console:
*/
QCS.Views.Console.Close = function() {
	$('body').removeClass("footer-opened");
}


/*
*	Open the South Console:
*/
QCS.Views.Console.ToggleOpen = function() {
	$('body').toggleClass("footer-opened");
}



/*
*	Get a timestamp string:
*/
QCS.Views.Console.GetTime = function() {
	var cDate = new Date();
    var sDate = cDate.getUTCFullYear() + "-" +
    QCS.Views.Console.ZeroPad( (cDate.getUTCMonth()+1), 2) +"-" +
    QCS.Views.Console.ZeroPad(cDate.getUTCDate(),2) + " " +
    QCS.Views.Console.ZeroPad(cDate.getUTCHours(),2) + ":" +
    QCS.Views.Console.ZeroPad(cDate.getUTCMinutes(),2) + ":" +
    QCS.Views.Console.ZeroPad(cDate.getUTCSeconds(),2);
    return sDate;
}


/*
*	Add Zeros to the time string.
*/
QCS.Views.Console.ZeroPad = function(dNumber, iPlaces) {
	var zero = iPlaces - dNumber.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + dNumber;
}


/*
*	Count the number of lines currently in the console.
*/
QCS.Views.Console.CountLines = function( sText ){
	aLines = sText.split(/\r\n|\r|\n/);
	return aLines.length;
}

/*
*	Add new text to the top of the console.
*/
QCS.Views.Console.AddText = function( sText, eStyle ){
	// Set the new lines
	var self = QCS.Views.Console.self;
	var iLines = this.CountLines( sText );
	self.newLines( self.newLines() + iLines );

	switch(eStyle){
		case 'error':
			colorClassName = 'console-error';
			break;
		case 'warning':
			colorClassName = 'console-warning';
			break;
		case 'info':
			colorClassName = 'console-info';
			break;
		default:
		case 'success':
			colorClassName = 'console-success';
			break;
	}

	var oObj = {
		color : colorClassName,
		text : QCS.Views.Console.GetTime() + " " + sText
	};

	// Set the text
	self.consoleText.unshift(oObj);
}


/*
*	Reset the console text to 0;
*/
QCS.Views.Console.Reset = function(){
	var self = QCS.Views.Console.self;
	self.consoleText.clear();
}


/*
*	Reset the new line counter
*/
QCS.Views.Console.ResetNewLines = function(){
	var self = QCS.Views.Console.self;
	self.newLines(0);
}


/*
*	 KO CORE:
*/
QCS.Views.Console.fn = function(KOCore){
	this.KOCore = KOCore;
	this.consoleText = ko.observableArray();
	this.newLines = ko.observable(0);
	var self = this;
	QCS.Views.Console.self = this;

	this.CountLines = QCS.Views.Console.CountLines;
	this.AddText = QCS.Views.Console.AddText;
	this.ResetNewLines = QCS.Views.Console.ResetNewLines;
	this.Reset = QCS.Views.Console.Reset;
	this.Open = QCS.Views.Console.Open;
	this.Close = QCS.Views.Console.Close;
	this.ToggleOpen = QCS.Views.Console.ToggleOpen;
	this.GetTime = QCS.Views.Console.GetTime;
	this.ZeroPad = QCS.Views.Console.ZeroPad;
};
