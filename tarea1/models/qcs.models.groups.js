/*
 *	This file have all the declaration of QC.model.projects
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

QCS.Models.Groups = [];


/*
*	Group Model.
*/
function Group(data) {

	this.id = ko.observable(data.id);

	this.sGroupName = ko.observable(data.sGroupName);

	this.sGroupNameLabel = ko.computed(function() {

    	var name = this.sGroupName();

		switch(name){
			case 'Private':
				name = 'Clone My Algorithms';
				break;
			case 'Community':
				name = 'Clone a Community Algorithm'
				break;
			default:
				name = "Clone from "  + name +" Group";
		} // switch

		return name;
	}, this);

	this.sIcon = ko.observable(data.sIcon);

	this.newProjectTabId = ko.computed(function() {
        return 'new-projectTab-'+this.sGroupName().replace(/\s/g, '');
    }, this);
}


/*
*	KO CORE:: Initialize the Group Models
*/
QCS.Models.Groups = function(KOCore) {

    this.KOCore = KOCore;
    var self = this;
    self.data = ko.observableArray([]);

	self.GetAll = function(){
		return self.data;
	};

    $.getJSON("/terminal/processGroups/read", function(aGroups) {
        var mappedGroups = $.map(aGroups, function(item) { return new Group(item) });
        self.data(mappedGroups);
    });
};