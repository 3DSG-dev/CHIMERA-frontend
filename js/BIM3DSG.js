var _toolbarHeight;
var firstShow = true;

// Events functions
$(document).ready(function () {
    ResizeHeaderLoghi();
    SetKendo();
    Login();
});

$(window).resize(function () {
    ResizeHeaderLoghi();
});

// Resize functions
function ResizeHeaderLoghi() {
    var widthScreen = $(window).width();
    var spazioPerLoghi = widthScreen - $(".user-container").outerWidth() - $(".logout-container").outerWidth();

    // quando lo spazio per entrambi i loghi small non è abbastanza
    if (spazioPerLoghi <= 200) {
        $("#logo3DSurveySmall").hide();
        $("#logo3DSurveyLarge").hide();
        $("#logoPolimiSmall").hide();
        $("#logoPolimiLarge").hide();
    }
    // quando basta lo spazio solo per il logo 3dsurvey SMALL (138px) <206
    else if (spazioPerLoghi <= 226) {
        $("#logo3DSurveySmall").show();
        $("#logo3DSurveyLarge").hide();
        $("#logoPolimiSmall").hide();
        $("#logoPolimiLarge").hide();

        // quando basta lo spazio solo per il logo 3dsurvey SMALL e Poli SMALL 138+68 < 531
    } else if (spazioPerLoghi <= 551) {
        $("#logo3DSurveySmall").show();
        $("#logo3DSurveyLarge").hide();
        $("#logoPolimiSmall").show();
        $("#logoPolimiLarge").hide();

        // quando basta lo spazio solo per il logo 3dsurvey BIG e Poli SMALL < 671
    } else if (spazioPerLoghi <= 691) {
        $("#logo3DSurveySmall").hide();
        $("#logo3DSurveyLarge").show();
        $("#logoPolimiSmall").show();
        $("#logoPolimiLarge").hide();

        // quando basta lo spazio per entrambi i loghi BIG < 671
    } else if (spazioPerLoghi > 691) {
        $("#logo3DSurveySmall").hide();
        $("#logo3DSurveyLarge").show();
        $("#logoPolimiSmall").hide();
        $("#logoPolimiLarge").show();
    }
}


// Login functions
function Login() {
    if ($("#actualUser").text() == "") {
        $('#LoginDialog').data("kendoDialog").open();
    };
}


// Kendo UI functions
function SetKendo() {

    function SetLoginDialog() {
        function LoginDialogForms_OnKeyUp() {
            $("#password").keyup(function (event) {
                if (event.keyCode == 13) {
                    $(".loginboard-title .k-primary").click();
                }
            });

            $("#username").keyup(function (event) {
                if (event.keyCode == 13) {
                    $(".loginboard-title .k-primary").click();
                }
            });
        }

        $('#LoginDialog').kendoDialog({
            width: "250px",
            title: "Login board",
            closable: false,
            modal: true,
            content: "<form id=\"loginForm\" method=\"post\" action=\"./\" data-ajax=\"false\">\n" +
                "              <div class=\"user-wrap\">" +
                "                 <label for=\"username\" class=\"login-label\" >User:</label><br>\n" +
                "                 <input type=\"text\" name=\"user\" id=\"username\" class=\"login-input\" value=\"\" placeholder=\"username\">\n" +
                "              </div>" +
                "              <div class=\"pwd-wrap\">" +
                "                   <label for=\"password\" class=\"login-label\">Password:</label><br>\n" +
                "                   <input type=\"password\" name=\"pwd\" id=\"password\" class=\"login-input\" value=\"\" placeholder=\"password\">\n" +
                "               </div>" +
                "           </form>",
            actions: [
                {text: 'LOGIN', primary: true, action: OnLoginSubmit}
            ],
        });

        $('#LoginDialog').parents(".k-widget").addClass("loginboard-title");

        LoginDialogForms_OnKeyUp();
    }

    function OnLoginSubmit() {
        $("#loginForm").submit();
    }

    if ($("#actualUser").text() == "") {
        SetLoginDialog();
    }
}