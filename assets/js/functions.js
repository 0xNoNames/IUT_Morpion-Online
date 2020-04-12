//variables globales
var color = getcolorCookie("colors");
if (color == null) {
  color = [getColor(), getColor()];
}

// Fonctions
//source https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getcookieName(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}

function changecolorCookie() {
  document.cookie = "colors=" + getColor() + "," + getColor();
  color = getcolorCookie();
}

function getcolorCookie() {
  let cookie = getcookieName("colors");
  if (typeof cookie === 'undefined') {
    changecolorCookie();
    getcolorCookie();
  } else {
    let colorcookie = cookie.split(',');
    return [colorcookie[0], colorcookie[1]];
  }
}

function getColor() {
  let hue = (360 * Math.random()) / 360;
  let rgb = toRgb(hue);
  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

// j'ai recupere un bout de code qui permet de passer du HSL au RGB que j'ai modifie pour pouvoir toujours avoir des couleurs lumineuses (la saturation = 1 et la luminosité = 0.5) pour les fonctions primarytoRgb et toRgb
// source https://web.archive.org/web/20081227003853/http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
function toRgb(hue) {
  return [primarytoRgb(hue + 1 / 3), primarytoRgb(hue), primarytoRgb(hue - 1 / 3)];
}

function primarytoRgb(t) { //modifé pour faire saturation=1 et luminosité=0.5
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return 6 * t;
  if (t < 1 / 2) return 1;
  if (t < 2 / 3) return (2 / 3 - t) * 6;
  return 0;
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
  $('#scoreboard, #pendingboard, #loggedboard, #name, #disconnect, #local').hide();
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

  $('#form-params').on('submit', function () {
    $.ajax({
      url: $(this).attr('action'),
      method: $(this).attr('method'),
      data: $(this).serialize() + "&player2=" + user
    }).done(function (data) {
      if (data.success) {
        window.location.href = '/game.html';
      } else {
        $('#messages').finish().hide().html(data.message).fadeIn();
      }
    }).fail(() => {
      $('body').css({
        'color': 'white',
        'font-size': '25px'
      }).html('Fatal error at params.php');
    });
    return false;
  });

  $('#form-params > input:checked + label').css({
    'background-color': HextoRGBA(0.75, color, 1),
    'box-shadow': boxShadow(HextoRGBA(0.25, color, 1))
  });

  $('body').append("<button id=\"home\">Accueil</button>");
  $('#home').click(function () {
    $('#params, #messages').empty().hide();
    $('#home').remove();
    $('#loggedboard, #scoreboard, #pendingboard, #name, #disconnect, #pannel').show();
  });
}

function showUsers(parsed) {
  if (parsed.logged != 0) {
    $('#navusers').show();
    $('#loggedboard > header').html("Cliquez sur un utlisateur pour lancer une partie");
    $('#navusers').html("<ul></ul>");
    for (i = 0; i < parsed.logged.length; i++) {
      $('#navusers > ul').append('<li><button id="loguser' + i + '">' + parsed.logged[i][0] + '</button></li>');
      if (parsed.logged[i][1] == 0) {
        $('#loguser' + i).css({
          'background-color': 'rgba(0, 255, 0, 0.5)',
          'box-shadow': boxShadow('rgba(0, 255, 0, 0.1)'),
          'cursor': 'pointer'
        }).hover(function () {
          $(this).css({
            'background-color': 'rgba(0, 255, 0, 0.75)',
            'box-shadow': boxShadow('rgba(0, 255, 0, 0.15)')
          });
        }, function () {
          $(this).css({
            'background-color': 'rgba(0, 255, 0, 0.5)',
            'box-shadow': boxShadow('rgba(0, 255, 0, 0.1)')
          });
        }).click(function () {
          paramsGame($(this).html());
        });
      } else {
        $('#loguser' + i).css({
          'background-color': 'rgba(255, 0, 0, 0.5)',
          'box-shadow': boxShadow('rgba(255, 0, 0, 0.1)'),
          'cursor': 'not-allowed'
        }).hover(function () {
          $(this).css({
            'background-color': 'rgba(255, 0, 0, 0.75)',
            'box-shadow': boxShadow('rgba(255, 0, 0, 0.15)')
          });
        }, function () {
          $(this).css({
            'background-color': 'rgba(255, 0, 0, 0.5)',
            'box-shadow': boxShadow('rgba(255, 0, 0, 0.1)')
          });
        })
      }
    }
    if (parsed.pendings != '') {
      $('#navrequests').html('<ul></ul>');
      for (let i = 0; i < parsed.pendings.length; i++) {
        $('#navrequests > ul').append('<li><button id=\'pending' + i + '\'>' + parsed.pendings[i][0] + ' | bo' + parsed.pendings[i][1] + '</button></li>');
        $('#pending' + i).data("host", parsed.pendings[i][0]).css({
          'background-color': HextoRGBA(0.5, color, i % 1),
          'box-shadow': boxShadow(HextoRGBA(0.1, color, i % 1)),
          'cursor': 'pointer'
        }).hover(function () {
          $(this).css({
            'background-color': HextoRGBA(0.75, color, i % 1),
            'box-shadow': boxShadow(HextoRGBA(0.25, color, i % 1))
          });
        }, function () {
          $(this).css({
            'background-color': HextoRGBA(0.5, color, i % 1),
            'box-shadow': boxShadow(HextoRGBA(0.1, color, i % 1)),
          });
        }).click(function () {
          $.ajax({
            url: 'assets/php/game.php',
            method: 'post',
            data: {
              host: $(this).data("host")
            }
          }).done(function (data) {
            if (data.success) {
              window.location.href = '/game.html';
            } else {
              $('#messages').finish().hide().html(data.message).fadeIn();
            }
          }).fail(function () {
            $('body').css({
              'color': 'white',
              'font-size': '25px'
            }).html('Fatal error at game.php from showuser().click() ajax');
          });
        });
      }
    } else {
      $('#navrequests > ul').html("<li>Pas de demandes</li>").css({
        "font-size": "75%",
        'padding-top': "5%",
        'color': HextoRGBA(1, color, 0)
      });
    }
  } else {
    $('#navusers').hide();
    $('#loggedboard > header').html("Pas d'utilisateurs connectés");
    $('#navrequests > ul').html("<li>Pas de demandes</li>").css({
      "font-size": "75%",
      'padding-top': "5%",
      'color': HextoRGBA(1, color, 0)
    });
  }
  $('#navscores').html('');
  for (let i = 0; i < parsed.scores.length; i++) {
    $('#navscores').append('<ul id=\'user' + i + '\'><span>' + (i + 1) + ') ' + parsed.scores[i][0] + '</span><span>' + parsed.scores[i][1] % 5 + '</span></ul>');
    if (i % 2 == 0) {
      $('#user' + i).css('color', color[0]);
    } else {
      $('#user' + i).css('color', color[1]);
    }
  }

  $('#name').html("Bienvenue <span>" + parsed.username + "</span>");
  $('#name > span').css('color', HextoRGBA(1, color, 0));
  $('#loggedboard, #pendingboard, #scoreboard').show();
  document.body.style.cursor = "default";
}

function connected(dataconnect) {
  if ($("#params").is(":hidden")) showUsers(dataconnect);
  document.body.style.cursor = "default";
  $.ajax({
    url: 'assets/php/connected.php',
    method: 'get',
  }).done(function (data) {
    if (data.success) {
      let done = data;
      setTimeout(() => {
        connected(done);
      }, 3000);
    } else {
      window.location.reload();
    }
  }).fail(() => {
    $('body').css({
      'color': 'white',
      'font-size': '25px'
    }).html('Fatal error at connected.php from connected() ajax');
  });
}
