/*
 *	This file have all the declaration of QC.Controllers.Reize
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

QCS.Controllers.Resize = [];


/*
*	QCS.Controllers.Resize Initialize
*/
QCS.Controllers.Resize.Initialize = function() {

	$(".body-row .content, #nav-tabs-project-data").resize(function() {
    	QCS.Controllers.Resize.TabRepo();
	});

	$.wait( function(){
		//Trigger them all once.
		QCS.Controllers.Resize.TriggerAll();
		console.log("Final Resize Triggered");
	}, 500);
}


/*
*	Resize the Tab Repo Handler:
*/
QCS.Controllers.Resize.TabRepo = function(){
	var columnWidth = $(".body-row .content").width();
   	var controlsWidth = $('#nav-tabs-controls').width();
   	var projectDataWidth = $('#nav-tabs-project-data').width();
   	var tabRepoWidth = columnWidth - projectDataWidth - controlsWidth - 5;
   	//console.log("Resize event triggered: ColWidth: " + columnWidth + " Controls Width: " + controlsWidth + " tabRepoWidth: " + tabRepoWidth);
   	$('#tab-repo').width(tabRepoWidth);
}


/*
*	Trigger all the divs we monitor
*/
QCS.Controllers.Resize.TriggerAll = function(){
	QCS.Controllers.Resize.TabRepo();
}

/*
*	KO Core
*/
QCS.Controllers.Resize.fn = function(KOCore){
	this.KOCore = KOCore;
	this.TabRepo = QCS.Controllers.Resize.TabRepo;
	this.Initialize = QCS.Controllers.Resize.Initialize;
	this.TriggerAll = QCS.Controllers.Resize.TriggerAll;

	this.Initialize();
};