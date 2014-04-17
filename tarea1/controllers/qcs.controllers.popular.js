/*
 *	Controller For Popular Behaviours:
 *	Popular Tab in Left Menu
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

QCS.Controllers.Popular = [];


/*
*	Like the post handler:
*/
QCS.Controllers.Popular.LikePost = function(obj, event) {

	var liker = $(event.target).parent();
	console.log("Like event triggered: ", obj, liker);

	if ($(liker).hasClass('post-liked')) return;

	var toggleClass = "post-liked";
	var iDiscussionID = $(liker).data('idiscussionid');
	var iScore = $(liker).data('iscore');
	var thumbUp = '<i class="fa fa-thumbs-up"></i>';
	$(liker).addClass('post-liked');
	$(liker).html(thumbUp + " " + (iScore + 1));

	if (typeof iDiscussionID != 'undefined' ) {
		$.post( "/forum/discussion/vote" + obj.sSource() + "/" + obj.iSourceId() + "/voteup/" + sTransientKey, function( data ) {
			//Nothing.
		});
	}
}


/*
*	Clone post handler: event.target == button caller.
*/
QCS.Controllers.Popular.CloneProject = function(obj, event) {
	console.log("Clone event triggered: ", obj, event);
	QCS.Controllers.Projects.CloneProject(obj.iProjectID(), obj.sName(), obj.sSimulationID());
	return false;
}


/*
*	KO CORE:
*/
QCS.Controllers.Popular.fn = function(KOCore){
	this.KOCore = KOCore;

	/*
	*	Custom Event Handlers:
	*/
	this.LikePost = QCS.Controllers.Feed.LikePost;
	this.CloneProject = QCS.Controllers.Feed.CloneProject;
};