// Events functions
$(document).ready(function () {
    ResizeHeaderLoghi();
    Login();
});

$(window).resize(function () {
    ResizeHeaderLoghi();
});

// Resize functions
function ResizeHeaderLoghi() {
    var spazioPerLoghi = $(window).width() - $("#user-container").outerWidth() - $("#logout-container").outerWidth();

    // quando lo spazio per entrambi i loghi small non è abbastanza
    if (spazioPerLoghi <= 200) {
        $("#logo-3dsurvey-small").hide();
        $("#logo-3dsurvey-large").hide();
        $("#logo-polimi-small").hide();
        $("#logo-polimi-large").hide();
    }
    // quando basta lo spazio solo per il logo 3dsurvey SMALL (138px) <226
    else if (spazioPerLoghi <= 226) {
        $("#logo-3dsurvey-small").show();
        $("#logo-3dsurvey-large").hide();
        $("#logo-polimi-small").hide();
        $("#logo-polimi-large").hide();

        // quando basta lo spazio solo per il logo 3dsurvey SMALL e Poli SMALL 138+68 < 551
    } else if (spazioPerLoghi <= 551) {
        $("#logo-3dsurvey-small").show();
        $("#logo-3dsurvey-large").hide();
        $("#logo-polimi-small").show();
        $("#logo-polimi-large").hide();

        // quando basta lo spazio solo per il logo 3dsurvey BIG e Poli SMALL < 691
    } else if (spazioPerLoghi <= 691) {
        $("#logo-3dsurvey-small").hide();
        $("#logo-3dsurvey-large").show();
        $("#logo-polimi-small").show();
        $("#logo-polimi-large").hide();

        // quando basta lo spazio per entrambi i loghi BIG < 691
    } else if (spazioPerLoghi > 691) {
        $("#logo-3dsurvey-small").hide();
        $("#logo-3dsurvey-large").show();
        $("#logo-polimi-small").hide();
        $("#logo-polimi-large").show();
    }
}

// Login functions
function Login() {
    if ($("#actual-user").text() == "") {
        SetLoginDialog();
        $('#login-dialog').data("kendoDialog").open();

        function SetLoginDialog() {
            function OnLoginSubmit() {
                $("#login-form").submit();
            }

            function LoginDialog_OnKeyUp() {
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

            $('#login-dialog').kendoDialog({
                width: "250px",
                title: "Login board",
                closable: false,
                modal: true,
                content: '<form id="login-form" method="post" action="./">' +
                         '  <div class="user-wrap">' +
                         '    <label for="username" class="login-label" >User:</label><br>' +
                         '    <input type="text" name="user" id="username" class="login-input" value="" placeholder="username">' +
                         '  </div>' +
                         ' <div class="pwd-wrap">' +
                         '    <label for="password" class="login-label">Password:</label><br>' +
                         '    <input type="password" name="pwd" id="password" class="login-input" value="" placeholder="password">' +
                         '  </div>' +
                         '</form>',
                actions: [
                    {text: 'LOGIN', primary: true, action: OnLoginSubmit}
                ]
            });

            $('#login-dialog').parents(".k-widget").addClass("loginboard-title");

            LoginDialog_OnKeyUp();
        }
    }
}



