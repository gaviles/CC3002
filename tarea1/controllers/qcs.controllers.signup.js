/*
 *	Controller For SignUp Behaviours:
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

QCS.Controllers.SignUp = [];


/*
*	Show the modal when the user isn't logged in yet:
*/
QCS.Controllers.SignUp.Load = function() {

	//Load the template HTML from the page:
	var sSignUpTemplate = $('#template-signup').html();

	if (window.bLoggedIn) {
		return;
	}

	bootbox.dialog({
		message : sSignUpTemplate,
		title : "Sign Up to QuantConnect",
		className : "modal-hide-title modal-signup",
		buttons : {
			success: {
				label: "<i class='fa fa-1x fa-spinner fa-spin signup-modal-loading'></i> Sign Up",
				className: "btn-warning",
				callback: function() {
					//Download the form data, perform error checks and then get sign up success.
					var sEmail = $('#signup-modal-email').val();
					var sName = $('#signup-modal-name').val();
					var sPassword = $('#signup-modal-password').val();
					var oForm = $('#signup-dialog');

					$('.signup-modal-loading').show();

					//Validate the data:
					var aError = [];
					if (sEmail == "") aError.push("Please enter a valid email address");
					if (sName == "") aError.push("Please enter your full name");
					if (sPassword.length < 6) aError.push("Please ensure your password is at least 6 characters");

					if (aError.length > 0) {
						var sError = aError.join('<br>');
						$('.signup-modal-errors').show();
						$('#signup-modal-errors').html(sError);
						$.growl.error({message: sError});
						$('.signup-modal-loading').hide();
						return false;
					}

					$.ajax({
						url: "/index.php?key=processSignUp&ajax=true",
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						data : {
							email : sEmail,
							name : sName,
							password : sPassword
						},
						success: function(data){
							if (data.status == "success") {
								$.growl.success({ message: "Signed up successfully. Please wait..." });
								oForm.get(0).submit();
							} else {
								$.growl.error({ message: data.message });
								$('#signup-modal-errors').html(data.message);
								$('.signup-modal-loading').hide();
							}
						},
						error: function(xhr, textStatus, errorThrown) {
							$.growl.error({ message: "Connection Error, action cancelled." });
							$('.signup-modal-loading').hide();
							return false;
						}
					});
					return false;
				}
			},
			login: {
				label: "Already a member? Login",
				className: "btn-default pull-left",
				callback: function() {
					window.location.href = '/login';
				}
			}
		}
	});
}




/*
*	KO CORE:
*/
QCS.Controllers.SignUp.fn = function(KOCore){
	this.KOCore = KOCore;

	/*
	*	Custom Event Handlers:
	*/
	this.Load = QCS.Controllers.SignUp.Load;

	this.Load();
};