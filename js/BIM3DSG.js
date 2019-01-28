// Events functions
$(document).ready(function () {
    ResizeHeaderLoghi();
});

$(window).resize(function () {
    ResizeHeaderLoghi();
});

// Resize functions
function ResizeHeaderLoghi() {
    var widthScreen = $(window).width();
    //var spazioPerLoghi = widthScreen - $(".user-container").outerWidth() - $(".logout-container").outerWidth();
    var spazioPerLoghi = widthScreen;

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
