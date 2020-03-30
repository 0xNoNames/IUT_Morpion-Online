//Variables globales
var color = getcolorCookie("colors");
if (color == null) {
    color = [getColor(), getColor()];
}

// Fonctions

function changecolorCookie() {
    document.cookie = "colors=" + getColor() + "," + getColor();
    color = getcolorCookie();
}

function getcolorCookie() {
    var cookie = document.cookie.split(';')[0].split('=');
    if (cookie[0] == "colors") {
        var color = cookie[1].split(',');
        return [color[0], color[1]];
    } else {
        changecolorCookie();
        getcolorCookie();
    }
}

function getColor() {
    var hue = (360 * Math.random()) / 360;
    var rgb = toRgb(hue);
    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

function hue2rgb(t) { //modifé pour faire S=1 et L=0.5
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return 6 * t;
    if (t < 1 / 2) return 1;
    if (t < 2 / 3) return (2 / 3 - t) * 6;
    return 0;
}

function toRgb(hue) {
    return [hue2rgb(hue + 1 / 3), hue2rgb(hue), hue2rgb(hue - 1 / 3)];
}

function toHex(rgb) {
    const hex = Math.round(rgb * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function HextoRGBA(alpha, color, index) {
    return 'rgba(' + hexToRgb(color[index]).r + ',' + hexToRgb(color[index]).g + ',' + hexToRgb(color[index]).b + ',' + alpha + ')';
}

function boxShadow(color) {
    return "0 0 5px " + color + ", 0 0 10px " + color + ", 0 0 15px " + color + ", 0 0 20px " + color + ", 0 0 30px " + color + ", 0 0 40px " + color + ", 0 0 55px " + color;

}


function paramsGame(user) {
    $('#pannel, #name, #connectedusers, #disconnect, #scoreboard').hide();
    $('#params').append(
        "    <form id=\"form-params\" action=\"assets/php/params.php\" method=\"post\" enctype=\"multipart/form-data\" autocomplete=\"off\" >\n" +
        "<span>Adversaire : " + user + "</span>\n" +
        "      <input type=\"radio\" id=\"bo1\" name=\"bestof\" value=\"1\" checked=\"checked\">\n" +
        "      <label for=\"bo1\">Best of 1</label>\n" +
        "      <input type=\"radio\" id=\"bo3\" name=\"bestof\" value=\"3\">\n" +
        "      <label for=\"bo3\">Best of 3</label>\n" +
        "      <input type=\"radio\" id=\"bo5\" name=\"bestof\" value=\"5\">\n" +
        "      <label for=\"bo5\">Best of 5</label>\n" +
        "      <button id=\"paramSendButton\" type=\"submit\">Démarrer !</button>\n" +
        "    </form>").show();

    $('#paramSendButton').css({
        'background-color': HextoRGBA(0.5, color, 0),
        'box-shadow': boxShadow(HextoRGBA(0.1, color, 0))
    }).hover(() => {
        $('#paramSendButton').css({
            'background-color': HextoRGBA(0.75, color, 0),
            'box-shadow': boxShadow(HextoRGBA(0.25, color, 0))
        });
    }, () => {
        $('#paramSendButton').css({
            'background-color': HextoRGBA(0.5, color, 0),
            'box-shadow': boxShadow(HextoRGBA(0.1, color, 0))
        });
    });

    $('#form-params > input:checked + label').css({
        'background-color': HextoRGBA(0.75, color, 1),
        'box-shadow': boxShadow(HextoRGBA(0.25, color, 1))
    });

    $('body').append("<button id=\"home\">Accueil</button>");
    $('#home').click(function () {
        $('#params').empty().hide();
        $('#home').remove();
        $('#pannel, #name, #connectedusers, #disconnect, #scoreboard').show();
    });
}

function showUsers(parsed) {
    $('#scores').html('');
    for (var i = 0; i < parsed.scores.length; i++) {
        $('#scores').append('<ul id="user' + i + '"><span>' + parsed.scores[i][0] + "</span><span'>" + parsed.scores[i][1] + '</span></ul>');
        if (i % 2 == 0) {
            $('#user' + i).css('color', color[0]);
        } else {
            $('#user' + i).css('color', color[1]);
        }
    }
    if (parsed.logged != 0) {
        $('#navusers').show();
        $('#name').html("Bienvenue <span>" + parsed.username + "</span>");
        $('#connectedusers > header').html("Cliquez sur un utlisateur pour lancer une partie");
        $('#name > span').css('color', HextoRGBA(1, color, 0));
        $('#connectedusers > div > nav').html("");
        for (i = 0; i < parsed.logged.length; i++) {
            $('#connectedusers > div > nav').append('<ul id="' + i + '">' + parsed.logged[i][0] + '</ul>');
            if (parsed.logged[i][1]) {
                $('#connectedusers > div > nav > #' + i).css('color', "rgb(0,255,0)").click(function () {
                    paramsGame($(this).html());
                });
            } else {
                $('#connectedusers > div > nav > #' + i).css('color', "rgb(255,0,0)");
            }
        }
    } else {
        $('#name').html("Bienvenue <span>" + parsed.username + "</span>");
        $('#name > span').css('color', HextoRGBA(1, color, 0));
        $('#navusers').hide();
        $('#connectedusers > header').html("Pas d'utilisateurs connectés");
    }
}

function connected() {
    $.ajax({
        url: 'assets/php/connected.php',
        method: 'get',
    }).done(function (data) {
        if (data.success) {
            showUsers(data);
            var connectedTimeout = setTimeout(function () {
                connected();
            }, 5000);
        } else {
            window.location.reload();
        }
    }).fail(function () {
        $('body').html('Fatal error');
    });
}
