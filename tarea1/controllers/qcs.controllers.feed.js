/*
 *	Controller For Feed Behaviours:
 *	Feed Tab in Left Menu
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

QCS.Controllers.Feed = [];



/*
*	Like the post handler:
*/
QCS.Controllers.Feed.LikePost = function(obj, event) {

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
		$.post( "/forum/discussion/votediscussion/" + iDiscussionID + "/voteup/" + sTransientKey, function( data ) {
			//Nothing.
		});
	}
}


/*
*	Clone post handler: event.target == button caller.
*/
QCS.Controllers.Feed.CloneProject = function(obj, event) {
	console.log("Clone event triggered: ", obj, event);
	QCS.Controllers.Projects.CloneProject(obj.iProjectID(), obj.sPostSubject(), obj.sSimulationID());
	return false;
}


/*
*	Submit a new comment, and update the model:
*/
QCS.Controllers.Feed.NewComment = function(obj, event) {
	console.log("New Comment Event: ", obj, event);
	event.stopPropagation(); // Stop the form submitting:

	//Disable submit button:
	var inputbox = event.target.children[0];
	$(inputbox).attr('disabled', true);

	//Send discussion
	$.post("/terminal/processFeed/newComment", {
		'discussion-id' : $(event.target).data('idiscussionid'),
		'comment-body' : inputbox.value
	}, function(data) {
		//Inject the new data into the model.
		console.log("Posted New Comment Successfully:", data);
		QCS.Models.Feed.SetModel(data);
		$(inputbox).attr('disabled', false);
	});

}


/*
*	Start a new discussion from the new form:
*/
QCS.Controllers.Feed.NewDiscussion = function(obj, event) {
	console.log("New Discussion Event: ", obj, event);
	event.stopPropagation(); // Stop the form submitting:
	QCS.Views.Feed.SetShareSimulationID();

	if (QCS.Models.Feed.GetBusyState()) {
		return;
	}

	//Set busy and don't allow reposting.
	QCS.Models.Feed.SetBusyState(true);

	//Fetch the objects:
	var oPostSubject = $('#question-subject');
	var oPostContent = $('#question-content');
	var oPostBacktestData = $('#attach-backtest-data');
	var oPostBacktestSelect = $('#attach-backtest-select');

	//Check for zero length:
	if (oPostSubject.val() == "") {bootbox.alert("Please enter a post subject."); return; }
	if (oPostContent.val() == "") {bootbox.alert("Please enter some post content."); return; }

	//Disable buttons:
	oPostSubject.disable(true);
	oPostContent.disable(true);
	oPostBacktestSelect.disable(true);

	//Send Discussion:
	$.ajax({
		type : "POST",
		url : "/terminal/processFeed/newPost",
		data : {
			'question-subject' : oPostSubject.val(),
			'question-content' : oPostContent.val(),
			'attach-backtest-data' : oPostBacktestData.val()
		},
		success : function(data){
			//Inject the new data into the model.
			console.log("Posted New Discussion Successfully:", data);
			QCS.Models.Feed.SetModel(data);
			//Reenable buttons:
			oPostSubject.val('');
			oPostContent.val('');
			oPostBacktestData.val('');
			QCS.Views.Feed.HidePostBox();
			QCS.Controllers.Chart.CreateSparklines();

			//Push the scroll back to top:
			$("#discussions").scrollTop(0);
			$("#discussions").perfectScrollbar('update');
			$.growl.success({ message : "New forum discussion posted successfully" });
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("Error sending post: " + errorThrown);
			$.growl.error({ message : "There was an error submitting the forum post, please try again later." });
		},
		complete : function() {
			oPostSubject.disable(false);
			oPostContent.disable(false);
			oPostBacktestSelect.disable(false);
			QCS.Models.Feed.SetBusyState(false);
			$('.post-loading').hide();
		}
	});

}



/*
*	Refresh the spark lines visibility
*/
QCS.Controllers.Feed.RefreshSparkLines = function() {
	$.wait(function() { $.sparkline_display_visible(); }, 5);
}

/*
*	make the feed active
*/
QCS.Controllers.Feed.show = function() {
	var self = QCS.Controllers.Feed.self;
	$.wait( function(){ self.KOCore.Controllers.Tabs.SetActive('menu-tab-header','feed'); } ,50 );
}

/*
*	KO CORE:
*/
QCS.Controllers.Feed.fn = function(KOCore){
	this.KOCore = KOCore;
	QCS.Controllers.Feed.self = this;

	/*
	*	Custom Event Handlers:
	*/
	this.LikePost 			= QCS.Controllers.Feed.LikePost;
	this.CloneProject 		= QCS.Controllers.Feed.CloneProject;
	this.NewComment 		= QCS.Controllers.Feed.NewComment;
	this.RefreshSparkLines 	= QCS.Controllers.Feed.RefreshSparkLines;
	this.show				= QCS.Controllers.Feed.show;
};