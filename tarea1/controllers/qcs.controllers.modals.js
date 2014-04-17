/*
 *	This file have all the declaration of QC.Controllers.Modals
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

QCS.Controllers.Modals = [];

/*
*	Display an alert modal for new file
*/
QCS.Controllers.Modals.NewFile = function() {

}

/*
*	Display an alert modal for new file
*/
QCS.Controllers.Modals.NewFile = function() {


}

QCS.Controllers.Modals.fn = function(KOCore){
	this.KOCore = KOCore;
	this.NewFile = QCS.Controllers.Modals.NewFile;
};