/*
 *	This file have all the declaration of QC.Model.Feed
 *
 */

if(typeof QCS == "undefined" )
{
	window.QCS = [];
	window.QCS.Models = [];
}
else if(typeof QCS.Models == "undefined")
{
	window.QCS.Models = [];
}

QCS.Models.Feed = [];


/*
*	Define Class Variables:
*/
QCS.Models.Feed.self = null;


/*
*	Define the Discussion Model
*/
function Discussion(data) {

    this.id = ko.observable(data.discussionid);
    this.sPostSubject = ko.observable(data.name);
	this.sPostBody = ko.observable(data.body);

	this.sAuthor = ko.observable(data.user.name);
	this.sAuthorImageFile = ko.observable(data.user.profileimage);
	this.iAuthorId = ko.observable(data.user.id);
	this.iAuthorForumId = ko.observable(data.insertuserid);
	this.sAuthorURL = ko.computed(function() {
        return 'https://www.quantconnect.com/forum/profile/'+this.iAuthorForumId() + "/" + this.sAuthor();
    }, this);
    this.sAuthorImageURL = ko.computed(function() {
    	return 'https://www.quantconnect.com/i/users/profile/'+this.sAuthorImageFile();
    }, this);
    this.sAuthorReputationText = ko.observable(data.user['reputation-display'].sPoints);
    this.sAuthorReputationColor = ko.observable(data.user['reputation-display'].sColor);

	this.sGroup = ko.observable(data.groupname);
	if (data.score == null) data.score = 0;
	this.iScore = ko.observable(data.score);
	this.bAttachedBacktest = false;
	this.sSimulationID = null;
	this.sSimulationSparkID = null;
	this.sSimulationName = null;
	this.sSimulationSparkline = null;
	this.iProjectID = null;

	if (data.simulationid != null) {
		this.bAttachedBacktest = true;
		this.iProjectID = ko.observable(data.projectid);
		this.sSimulationID = ko.observable(data.simulationid);
		this.sSimulationSparkID = "feed-" + data.simulationid;
		this.sSimulationName = ko.observable(data.simulationdata.sname);
		this.sSimulationSparkline = ko.observable(data.simulationdata.ssparkline);
	}

	this.sCloneProjectURL = ko.computed(function() {
		if (this.bAttachedBacktest) {
			return "/terminal/processClone/" + this.iProjectID() + "/" + this.sSimulationID();
		} else {
			return "#";
		}
	}, this);

	//Show the score if > 0.
	this.bShowScore = ko.computed(function() {
		//console.log("Showing score calculaton : " , this.iScore);
		if (this.iScore() > 0) { return true; }
		return false;
	}, this);

	//Initialize the comments
	this.aComments = ko.observableArray();

	this.bExpandComments = ko.observable(false);

	this.sCommentCount = ko.computed(function() {
		var bExpandComments = this.bExpandComments();
		if (!bExpandComments) {
			return "<i class='fa fa-plus-square-o'></i> Show " + data.comments.length + " comments";
		} else {
			return "<i class='fa fa-minus-square-o'></i> Hide comments";
		}
	}, this);

	for(i = 0; i < data.comments.length; i++) {
		var comment = data.comments[i];
		this.aComments.push({
			'iCommentID' : comment.commentid,
			'sCommentBody' : comment.body,
			'sCommentDate' : comment.dateinserted,
			'sCommentAuthorId' : comment.user.id,
			'sCommentAuthorName' : comment.user.name,
			'iCommentForumUserID' : comment.insertuserid,
			'sCommentAuthorURL' : ('https://www.quantconnect.com/forum/profile/' + comment.insertuserid + '/' + comment.user.name),
			'sCommentAuthorImageURL' : ('https://www.quantconnect.com/i/users/profile/' + comment.user.profileimage),
			'sCommentReputationPoints' : comment.user['reputation-display'].sPoints,
			'sCommentReputationColor' : comment.user['reputation-display'].sColor
		});
	}
};


/*
*	Get the Discussion Feed
*/
QCS.Models.Feed.Refresh =  function(){
    var self = this;
	$.getJSON("/terminal/processFeed/read", function(jnFiles) {
    	QCS.Models.Feed.SetModel(jnFiles);
    });
};



/*
*	Set a new model for the feed.
*/
QCS.Models.Feed.SetModel = function(newModel) {
	if (newModel !== null) {
		var aDiscussions = newModel.discussions;
		if (typeof aDiscussions !== 'undefined') {
			var mappedFeed = $.map(aDiscussions, function(post) { return new Discussion(post) });
			QCS.Models.Feed.self.data(mappedFeed);
		}
	}
}


/*
*	 Set the busy state of the model:
*/
QCS.Models.Feed.SetBusyState = function(bState) {
	var self = QCS.Models.Feed.self;
	self.bPostBusy(bState);
}


/*
*	Check whether the model is currently busy posting a discussion
*/
QCS.Models.Feed.GetBusyState = function() {
	var self = QCS.Models.Feed.self;
	return self.bPostBusy();
}


/*
*	Trigger a show of the comments
*/
QCS.Models.Feed.ExpandComments = function(discussion, state) {
	var self = QCS.Models.Feed.self;
	var discussions = self.data();
	if (typeof state === 'undefined') { state = true; }
	for(var i in discussions) {
		if (discussions[i].id() == discussion.id()) {
			discussions[i].bExpandComments(state);
		}
	}
}



/*
*	KO CORE::
*/
QCS.Models.Feed.fn = function(KOCore){

    this.KOCore = KOCore;
    this.bPostBusy = ko.observable(false);
    this.data = ko.observableArray([]);
	QCS.Models.Feed.self = this;


	//Expand the comments in the feed
    this.Refresh 		= QCS.Models.Feed.Refresh;
    this.SetModel 		= QCS.Models.Feed.SetModel;
    this.SetBusyState	= QCS.Models.Feed.SetBusyState;
    this.GetBusyState	= QCS.Models.Feed.GetBusyState;
    this.ExpandComments = QCS.Models.Feed.ExpandComments;

    this.GetAll = function(){
		return QCS.Models.Feed.self.data;
	};

    //Download recent feed
    this.Refresh();
};