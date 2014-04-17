/*
 *	This file have all the declaration of QC.Models.Popular
 *
 */

if(typeof QCS == "undefined" )
{
	QCS = [];
	QCS.Models = [];
}
else if(typeof QCS.Models == "undefined")
{
	QCS.Models = [];
}

QCS.Models.Popular = [];

/*
*	Define class variables:
*/
QCS.Models.Popular.self = null;


/*
*	Popular Model.
*/
function Popular(data) {

	//Simulation Result ID
	this.id = ko.observable(data.id);

	//Name of the shared algorithm
	this.sName = ko.observable(data.sName);

	//Discussion text of the algorithm
	this.sBodyRaw = data.sBody;

	this.sBody = ko.computed(function() {
		if (this.sBodyRaw != null) {
			return this.sBodyRaw.substr(0, 140) + '...';
		} else {
			return '...';
		}
	}, this);

	//Author Details
	this.iAuthorId = ko.observable(data.iAuthorID);
	this.iAuthorForumID = ko.observable(data.iAuthorForumID);
	this.sAuthor = ko.observable(data.sAuthorName);
	this.sAuthorName = ko.observable(data.sAuthorName);
	this.sAuthorImageFile = ko.observable(data.sAuthorImageFile);
	this.sAuthorURL = ko.computed(function() {
        return 'https://www.quantconnect.com/forum/profile/'+this.iAuthorForumID() + "/" + this.sAuthorName();
    }, this);
    this.sAuthorImageURL = ko.computed(function() {
    	return 'https://www.quantconnect.com/i/users/profile/'+this.sAuthorImageFile();
    }, this);
	this.sAuthorReputationColor = ko.observable(data.sAuthorReputationColor);
	this.sAuthorReputationText = ko.observable(data.sAuthorReputationText);

	//Simulation ID
	this.sSimulationID = ko.observable(data.sSimulationID);
	this.sSimulationSparkID = ko.computed(function() {
		return 'popular-' + this.sSimulationID();
	}, this);

	this.iProjectID = ko.observable(data.iProjectID);
	this.sSource = ko.observable(data.sSource);
	this.iSourceId = ko.observable(data.iSourceId);

	//Spark line of its chart
	this.bHaveSparkLine = ko.observable(false);
	this.sSimulationSparkline = "";

	if (data.sSimulationSparkline != null && data.sSimulationSparkline != "") {
		this.sSimulationSparkline = ko.observable(data.sSimulationSparkline);
		this.bHaveSparkLine(true);
	}

	//Votes for this algorithm
	if (data.iScore == null) {
		this.iScore = ko.observable(0);
	} else {
		this.iScore = ko.observable(data.iScore);
	}

	//Compute the clone URL for this algorithm
	this.sCloneProjectURL = ko.computed(function() {
		return "/terminal/processClone/" + this.iProjectID() + "/" + this.sSimulationID();
	}, this);
}


/*
*	Refresh the popular model.
*/
QCS.Models.Popular.Refresh = function() {
	console.log("Refreshing Popular Feed...");
	$.getJSON("/terminal/processPopular/read", function(jnFiles) {
    	QCS.Models.Popular.SetModel(jnFiles);
    });
};


/*
*	Set a new model for the feed.
*/
QCS.Models.Popular.SetModel = function(newModel) {
	if (newModel !== null) {
		var aPopular = newModel.popular;
		if (typeof aPopular !== 'undefined') {
			var mappedPopular = $.map(aPopular, function(post) { return new Popular(post) });
			QCS.Models.Popular.self.data(mappedPopular);
		}
	}
}




/*
*	KO CORE:: Initialize the Popular Ranking Models
*/
QCS.Models.Popular.fn = function(KOCore) {

    this.KOCore = KOCore;
    var self = this;
    self.data = ko.observableArray([]);
    QCS.Models.Popular.self = self;

    this.Refresh = QCS.Models.Popular.Refresh;
    this.SetModel = QCS.Models.Popular.SetModel;

	self.GetAll = function(){
		return self.data;
	};

	//Download recent feed
    this.Refresh();
};