/*
 *	This file have all the declaration of QC.controllers.projects
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

QCS.Controllers.Tabs = [];

/*
*	Removes all the active tabs
*/
QCS.Controllers.Tabs.RemoveActive = function(){
	this.KOCore.Views.CodeTab.RemoveAll();
	this.KOCore.Views.ResultTab.RemoveAll();
}

/*
*	Set the active tab, receves the if of the reference and the class of the tab header
*/
QCS.Controllers.Tabs.SetActive = function( sTabClass, sID ){
	$('.'+sTabClass+' a[href="#'+sID+'"]').setActiveTab();
}

/*
*	KO CORE:
*/
QCS.Controllers.Tabs.fn = function(KOCore){
	this.KOCore = KOCore;
	
	/*
	*	Intialize Function Handlers:
	*/
	this.RemoveActive 		= QCS.Controllers.Tabs.RemoveActive;
	this.RefreshTabScroll 	= QCS.Controllers.Tabs.RefreshTabScroll;
	this.SetActive 			= QCS.Controllers.Tabs.SetActive;
};