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

QCS.Views.Feed = [];

/*
*	Class Variables:
*/
QCS.Views.Feed.self = null;


/*
*	Initialize the Feed View:
*/
QCS.Views.Feed.Initialize = function() {

	//Initialize:
	var self = QCS.Views.Feed.self

	/*if (typeof pubnub == 'undefined') {
		$.wait(function() {
			QCS.Views.Feed.Initialize();
			console.log("Deferred Loading...");
		}, 250);
		return;
	}*/

	var pnCommunity = PUBNUB.init({
		publish_key: window.sPubnubPublish,
		subscribe_key: window.sPubnubSubscribe,
		ssl : true,
		uuid : window.iUserID
	});

	pnCommunity.subscribe({
		channel : 'Community',
		message : function(sMessage) {
			QCS.Models.Feed.Refresh();
		},
		connect : function() {
			console.log('Connected to Community updates');
		}
	});

	//Open the form when the user clicks the input.
	$('#question-content').focus(function() {
		QCS.Views.Feed.ShowPostBox()
	});
	$('#question-content').keydown(function() {
		QCS.Views.Feed.ShowPostBox()
	});
	$('#question-content').click(function() {
		QCS.Views.Feed.ShowPostBox()
	});

	//Handle a mouse leave event when the user hasnt written anything.
	$('.question-wrapper').mouseleave(function() {
		QCS.Views.Feed.HidePostBox();
	});

	//Open the Select Backtest Function.
	$('#attach-backtest-button').click(function() {
		$('#question-row').addClass('question-row-backtest');
		$('#discussions').addClass('discussion-compressed-backtest');
		QCS.Views.Feed.SetShareSimulationID(); // when only 1 item set it here.
	});

	//Clear the data object and hide the select on closing.
	$('#attach-backtest-close').click(function() {
		$('#question-row').removeClass('question-row-backtest');
		$('#discussions').removeClass('discussion-compressed-backtest');
		QCS.Views.Feed.ResetShareSimulationID();
	});

	//Set the hidden data object on selection
	$('#attach-backtest-select').change(function() {
		QCS.Views.Feed.SetShareSimulationID();
	});

	$('#attach-backtest-select').click(function() {
		if ($('#attach-backtest-select option').length == 0) {

			if (QCS.Controllers.Projects.iProjectID == null) {
				bootbox.alert("Please open a project first to attach a backtest here.");
			} else {
				bootbox.alert("Please run a backtest first to attach a backtest here.");
			}
		}
	});

	//Show the attachment options
	$('.attachment').mouseover(function() {
		$(this).children('.spark-actions').show();
	});
	$('.attachment').mouseleave(function() {
		$(this).children('.spark-actions').hide();
	});


}


/*
*	Hide the post comment box
*/
QCS.Views.Feed.HidePostBox = function(){
	if ($('#question-content').val() == '' && $('#question-content').is(":focus") == false) {
		$('#question-row').removeClass('question-row-focused');
		$('#question-row').removeClass('question-row-backtest');
		$('#discussions').removeClass('discussion-compressed');
		$('#discussions').removeClass('discussion-compressed-backtest');
		$('#attach-backtest-data').val('');
	}
}

/*
*	Show the post message box.
*/
QCS.Views.Feed.ShowPostBox = function(){
	$('#question-row').addClass('question-row-focused');
	$('#discussions').addClass('discussion-compressed');
}



/*
* 	Set the simualtion ID we want to share.
*/
QCS.Views.Feed.SetShareSimulationID = function(id){
	$('#attach-backtest-data').val(   $('#attach-backtest-select').val()   );
	console.log(   $('#attach-backtest-data').val() );
}



/*
*	Clear the simulation id stored.
*/
QCS.Views.Feed.ResetShareSimulationID = function() {
	$('#attach-backtest-data').val('');
}



/*
*	Expand the comments
*/
QCS.Views.Feed.ExpandComments = function(obj, event) {
	var state = ! obj.bExpandComments();
	QCS.Models.Feed.ExpandComments(obj, state);
}



/*
*	Show the user badges
*/
QCS.Views.Feed.ShowUserBadge = function(obj, event) {

	var iBadgeUserID = "", sBadgeAuthorName = "";

	if (typeof obj.iAuthorId != 'undefined') {
		iBadgeUserID = obj.iAuthorId();
		sBadgeAuthorName = obj.sAuthor();
	} else {
		iBadgeUserID = obj.sCommentAuthorId
		sBadgeAuthorName = obj.sCommentAuthorName;
	}

	//Final check:
	if (typeof iBadgeUserID == 'undefined') {

		iBadgeUserID = $(event.target).data('iauthorid');
		sBadgeAuthorName = $(event.target).html();
		console.log("SHOW BADGE FAILED: ", iBadgeUserID, sBadgeAuthorName);
	}

	bootbox.dialog({
	  message: "Loading User Profile...",
	  buttons: {
	    main: {
	      label: "Close",
	      className: "btn-primary",
	      callback: function() {
	      	//Close
	      }
	    }
	  }
	});

	$.ajax({
		url: "/terminal/processUserBadge/"+iBadgeUserID,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
			if (data.success == true) {
				//Get template:
				var template = $('#feed-glorybox').html();
				template = template.replaceAll("{{user-name}}",data.result.sUserName);
				template = template.replaceAll("{{user-image}}",data.result.sUserImage);
				template = template.replaceAll("{{user-since}}",data.result.sUserSince);
				template = template.replaceAll("{{backtests}}",data.result.iBacktests);
				template = template.replaceAll("{{sharpe-ratio}}",data.result.iMaxSharpeRatio);
				template = template.replaceAll("{{net-profit}}",data.result.sMaxNetProfit);
				template = template.replaceAll("{{forum-comments}}",data.result.iCommentCount);
				template = template.replaceAll("{{shared-algorithms}}",data.result.iSharedCount);
				template = template.replaceAll("{{cpu-hours}}",data.result.iUserTime);
				template = template.replaceAll("{{badge-color}}",data.result.iReputationDisplay.sColor);
				template = template.replaceAll("{{badge-points}}",data.result.iReputationDisplay.sPoints);

				//Author Results:
				$('.bootbox-body').html(template);

			} else {
				$.growl.error({ message: "Error fetching user profile." });
			}
			return true;
		},
		error: function(xhr, textStatus, errorThrown) {
			$.growl.error({ message: "Connection Error, action cancelled." });
			return false;
		}
	});
}


/*
*	KO CORE:
*/
QCS.Views.Feed.fn = function(KOCore){

	//Initialise:
	this.KOCore = KOCore;
	var self = this;
	QCS.Views.Feed.self = this;
	self.data = ko.observableArray([]);

	//Initialize the Functions
	this.Initialize = QCS.Views.Feed.Initialize;
	this.ShowPostBox = QCS.Views.Feed.ShowPostBox;
	this.HidePostBox = QCS.Views.Feed.HidePostBox;
	this.SetShareSimulationID = QCS.Views.Feed.SetShareSimulationID;
	this.ResetShareSimulationID = QCS.Views.Feed.ResetShareSimulationID;
	this.ShowUserBadges = QCS.Views.Feed.ShowUserBadges;
	this.ExpandComments = QCS.Views.Feed.ExpandComments;

	this.GetAll = function(){
		return self.data;
    };

    this.Initialize();
};

