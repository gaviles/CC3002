/*
 *	This file have all the declaration of QCS.Controllers.Api
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

QCS.Controllers.Simulate = [];

/*
*	Initialize the Globals:
*/
QCS.Controllers.Simulate.self = null;
QCS.Controllers.Simulate.bButtonEnabled = true;
QCS.Controllers.Simulate.sSimulationID = true;


/*
*	Initialize the Simulate API.
*/
QCS.Controllers.Simulate.Initialize = function() {
	var self = QCS.Controllers.Simulate.self;
	QCS.Controllers.Simulate.self.aAnimals = ['Horse','Zebra','Whale','Tapir','Barracuda','Cow','Cat',
       'Wolf','Hamster','Monkey','Pelican','Snake','Albatross',
       'Viper','Guanaco','Anguilline','Badger','Dogfish','Duck',
       'Butterfly','Gaur','Rat','Termite','Eagle','Dinosaur',
       'Pig','Seahorse','Hornet','Koala','Hippopotamus',
       'Cormorant','Jackal','Rhinoceros','Panda','Elephant',
       'Penguin','Beaver','Hyena','Parrot','Crocodile','Baboon',
       'Pony','Chinchilla','Fox','Lion','Mosquito','Cobra','Mule',
       'Coyote','Alligator','Pigeon','Antelope','Goat','Falcon',
       'Owlet','Llama','Gull','Chicken','Caterpillar','Giraffe',
       'Rabbit','Flamingo','Caribou','Goshawk','Galago','Bee',
       'Jellyfish','Buffalo','Salmon','Bison','Dolphin','Jaguar',
       'Dog','Armadillo','Gorilla','Alpaca','Kangaroo','Dragonfly',
       'Salamander','Owl','Bat','Sheep','Frog','Chimpanzee',
       'Bull','Scorpion','Lemur','Camel','Leopard','Fish','Donkey',
       'Manatee','Shark','Bear','kitten','Fly','Ant','Sardine'];
    QCS.Controllers.Simulate.self.aVerbs = ['Determined','Pensive','Adaptable','Calculating','Logical',
       'Energetic','Creative','Smooth','Calm','Hyper-Active',
       'Measured','Fat','Emotional','Crying','Jumping',
       'Swimming','Crawling','Dancing','Focused','Well Dressed',
       'Retrospective','Hipster','Square','Upgraded','Ugly',
       'Casual','Formal','Geeky','Virtual','Muscular',
       'Alert','Sleepy'];
    QCS.Controllers.Simulate.self.aColors = ['Red','Red-Orange', 'Orange', 'Yellow', 'Tan', 'Yellow-Green',
       'Yellow-Green', 'Fluorescent Orange', 'Apricot', 'Green',
       'Fluorescent Pink','Sky Blue','Fluorescent Yellow', 'Asparagus',
       'Blue', 'Violet', 'Light Brown','Brown', 'Magenta', 'Black'];
}


/*
*	Set the button state after the button is pressed.
*/
QCS.Controllers.Simulate.SetButtonState = function(bEnabled, sButtonText){
	self = this;
	QCS.Controllers.Simulate.bButtonEnabled = bEnabled;
	if (bEnabled) {
		$('#tab-backtest').removeClass('disabled');
		$('#tab-backtest .button-description').html("Backtest");
		console.log("Simulate button enabled");
	} else {
		$('#tab-backtest').addClass('disabled');
		$('#tab-backtest .button-description').html("Backtesting...");
		console.log("Simulate button disabled");
	}
	if (typeof sButtonText != 'undefined') $('#tab-backtest .button-description').html(sButtonText);
}


/*
*	Display a simulation result.
*/
QCS.Controllers.Simulate.SimulationResult = function(sSimulationID, lSimulationData, oSimulationResult){

	if (QCS.Controllers.Projects.iProjectID != lSimulationData.iProjectID) return;

	console.log("Recieved packet of data from backend", sSimulationID, lSimulationData, oSimulationResult);

	QCS.Models.Backtests.Update(sSimulationID, lSimulationData, oSimulationResult);
}


/*
*	Pass a runtime error back to the console:
*/
QCS.Controllers.Simulate.RuntimeError = function(aErrors) {
	console.log("Runtime error: ", aErrors);
}


/*
*	Send a simulate command to the server
*/
QCS.Controllers.Simulate.Backtest = function(){

	var iProjectID = QCS.Controllers.Projects.iProjectID;
	var sCompileID = QCS.Controllers.Compile.sCompileID;

	//Bounce out of handler if button disabled:
	if (!QCS.Controllers.Simulate.bButtonEnabled) return false;

	//Send the backtest request:
	//Make sure we have a compile id:
    if (sCompileID == null) {
        QCS.Controllers.Compile.Build(false, true);
        console.log("Launching auto-compile for backtest");
        return;
    }

    //Start the compile
    console.log('QCS Compiling: sCompileID:' + sCompileID);

    if (typeof iProjectID != "undefined" && iProjectID > 0) {
		QCS.Views.Console.AddText("Simulating Project ID: " + iProjectID);
		QCS.Controllers.Simulate.SetButtonState(false);

		//Get the default name:
        var sName = QCS.Controllers.Simulate.GetName();

		//Send Request:
        qc.api.simulate(sCompileID, sName, '', '', '',
        	function(oResponse) {
	            //Success sending simulation request:
				QCS.Views.Console.AddText("Successfully sent simulation request for '" + sName + "', (Compile Id: " + sCompileID + ")");
				QCS.Controllers.Simulate.SetButtonState(true);
	           	QCS.Models.Backtests.InsertFirst(sName, oResponse.sSimulationID, iProjectID);
	        },
	        function(oError) {
	            //Failure to send simulation request:
	            QCS.Views.Console.AddTextQCS.Console.Log("Sorry there was a failure sending the simulation request: " + oError.sResponseCode);
	            QCS.Controllers.Simulate.SetButtonState(true);

	            if(oError.sResponseCode == '401 UNAUTHORIZED') {
	                bootbox.alert('Your session expired. Please login again. You will now be redirected to login.', function() {
	                	window.location = "/processLogout";
					});
	            }
	        }
        ); // end of API.
    } else {
    	bootbox.alert("Please open a project");
	}
}


/*
*	Get the name of the next backtest.
*/
QCS.Controllers.Simulate.GetName = function(sName){

	var self = QCS.Controllers.Simulate.self;

	//If its not set, set a default:
    if (typeof sName === "undefined" || sName === "") {
        var sVerb = self.aVerbs[Math.floor(self.aVerbs.length * Math.random())];
        var sColor = self.aColors[Math.floor(self.aColors.length * Math.random())];
        var sAnimal = self.aAnimals[Math.floor(self.aAnimals.length * Math.random())];
        var sNewName = sVerb + " " + sColor + " " + sAnimal;
        return sNewName;
    }
    return sName;
}

/*
* KO CORE:
*/
QCS.Controllers.Simulate.fn = function(KOCore){
	this.KOCore 			= KOCore;
	this.self				= this;
	QCS.Controllers.Simulate.self = self;

	this.Initialize			= QCS.Controllers.Simulate.Initialize;
	this.SetButtonState 	= QCS.Controllers.Simulate.SetButtonState;
	this.SimulationResult 	= QCS.Controllers.Simulate.SimulationResult;
	this.Backtest 			= QCS.Controllers.Simulate.Backtest;
	this.GetName 			= QCS.Controllers.Simulate.GetName;
	this.RuntimeError		= QCS.Controllers.Simulate.RuntimeError;

	//Self Initialize:
	this.Initialize();
}