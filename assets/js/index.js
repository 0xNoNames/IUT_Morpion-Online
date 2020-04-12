(function () {
  'use strict';
  document.body.style.cursor = "wait";
  $(() => {
    $.ajax({
      url: 'assets/php/connected.php',
      method: 'get',
    }).done(function (data) {
      if (data.success) {
        if (data.in_game == 1) window.location.href = 'game.html';
        connected(data);
        $('#connexion, #inscription').remove();
        $('#disconnect, #local, #name').show();
      } else {
        $('#disconnect, #scoreboard, #loggedboard, #pendingboard, #name').remove();
        $('#connexion, #inscription, #local').show();
        $('#messages').html(data.message).fadeIn();
        document.body.style.cursor = "default";
      }
    }).fail(function () {
      $('body').css({
        'color': 'white',
        'font-size': '25px'
      }).html('Fatal error at connected.php from index.js ajax');
    });
  });

  $(document).ready(function () {
    particlesJS.load("particles-js", "particles.json", function () {
      $.each(pJSDom[0].pJS.particles.array, function (i, p) {
        if (i < pJSDom[0].pJS.particles.array.length / 2) {
          pJSDom[0].pJS.particles.array[i].color.value = color[0];
          pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[0]);
        } else {
          pJSDom[0].pJS.particles.array[i].color.value = color[1];
          pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[1]);
        }
      });
    });

    $('#loggedboard > header').css('color', HextoRGBA(1, color, 1));
    for (let i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].title == 'style') {
        document.styleSheets[i].addRule("::-webkit-scrollbar-thumb", 'background-color: ' + color[0]);
        break;
      }
    }


    $('#inscription').click(() => {
      window.location = 'register.html';
    }).css({
      'background-color': HextoRGBA(0.5, color, 0),
      'box-shadow': boxShadow(HextoRGBA(0.1, color, 0))
    }).hover(() => {
      $('#inscription').css({
        'background-color': HextoRGBA(0.75, color, 0),
        'box-shadow': boxShadow(HextoRGBA(0.25, color, 0))
      });
    }, () => {
      $('#inscription').css({
        'background-color': HextoRGBA(0.5, color, 0),
        'box-shadow': boxShadow(HextoRGBA(0.1, color, 0))
      });
    });

    $('#connexion').click(() => {
      window.location = 'login.html';
    }).css({
      'background-color': HextoRGBA(0.5, color, 1),
      'box-shadow': boxShadow(HextoRGBA(0.1, color, 1))
    }).hover(() => {
      $('#connexion').css({
        'background-color': HextoRGBA(0.75, color, 1),
        'box-shadow': boxShadow(HextoRGBA(0.25, color, 1))
      });
    }, () => {
      $('#connexion').css({
        'background-color': HextoRGBA(0.5, color, 1),
        'box-shadow': boxShadow(HextoRGBA(0.1, color, 1))
      });
    });

    $('#local').click(() => {
      window.location = 'local.html';
    });

    $('#disconnect').click(() => {
      $.ajax({
        url: 'assets/php/logout.php',
        method: 'get'
      }).done(function () {
        window.location.href = 'index.html';
      });
    })

    $('#params').click(function () {
      $('#form-params > input + label').css({
        'background-color': 'rgba(255, 255, 255, 0.3)',
        'box-shadow': "none"
      });
      $('#form-params > input:checked + label').css({
        'background-color': HextoRGBA(0.75, color, 1),
        'box-shadow': boxShadow(HextoRGBA(0.25, color, 1))
      });
    });


    $("div").click(function (event) {
      if (event.target.id != "inscription" && event.target.id != "local" && event.target.id != "connexion" && !$(event.target).is("button") && !$(event.target).is("label") && !$(event.target).is("input")) {
        changecolorCookie();
        $('#form-params > input:checked + label').css('background-color', HextoRGBA(0.5, color, 1));
        $('#name > span').css('color', HextoRGBA(1, color, 0));
        let i = 0;
        for (i = 0; i < document.styleSheets.length; i++) {
          if (document.styleSheets[i].title == 'style') {
            document.styleSheets[i].addRule("::-webkit-scrollbar-thumb", 'background-color: ' + color[0]);
            break;
          }
        }

        $('#loggedboard > header').css('color', HextoRGBA(1, color, 1));
        for (i = 0; $('#user' + i).val() != null; i++) {
          if (i % 2 == 0) $('#user' + i).css('color', color[0]);
          else $('#user' + i).css('color', color[1]);
        }

        $("#navrequests :button").css({
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
        });
        $("#navrequests > ul:contains('Pas de demandes')").css('color', HextoRGBA(1, color, 0));

        $('#inscription').css({
          'background-color': HextoRGBA(0.5, color, 0),
          'box-shadow': boxShadow(HextoRGBA(0.1, color, 0))
        }).hover(function () {
          $('#inscription').css({
            'background-color': HextoRGBA(0.75, color, 0),
            'box-shadow': boxShadow(HextoRGBA(0.25, color, 0))
          });
        }, function () {
          $('#inscription').css({
            'background-color': HextoRGBA(0.5, color, 0),
            'box-shadow': boxShadow(HextoRGBA(0.1, color, 0))
          });
        });

        $('#connexion').css({
          'background-color': HextoRGBA(0.5, color, 1),
          'box-shadow': boxShadow(HextoRGBA(0.1, color, 1))
        }).hover(function () {
          $('#connexion').css({
            'background-color': HextoRGBA(0.75, color, 1),
            'box-shadow': boxShadow(HextoRGBA(0.25, color, 1))
          });
        }, function () {
          $('#connexion').css({
            'background-color': HextoRGBA(0.5, color, 1),
            'box-shadow': boxShadow(HextoRGBA(0.1, color, 1))
          });
        });

        $('#paramSendButton').css({
          'background-color': HextoRGBA(0.5, color, 0),
          'box-shadow': boxShadow(HextoRGBA(0.1, color, 0))
        }).hover(function () {
          $('#paramSendButton').css({
            'background-color': HextoRGBA(0.75, color, 0),
            'box-shadow': boxShadow(HextoRGBA(0.25, color, 0))
          });
        }, function () {
          $('#paramSendButton').css({
            'background-color': HextoRGBA(0.5, color, 0),
            'box-shadow': boxShadow(HextoRGBA(0.1, color, 0))
          });
        });

        $('#form-params > input + label').css({
          'background-color': 'rgba(255, 255, 255, 0.3)',
          'box-shadow': "none"
        });
        $('#form-params > input:checked + label').css({
          'background-color': HextoRGBA(0.75, color, 1),
          'box-shadow': boxShadow(HextoRGBA(0.25, color, 1))
        });

        $.each(pJSDom[0].pJS.particles.array, function (i, p) {
          if (i < pJSDom[0].pJS.particles.array.length / 2) {
            pJSDom[0].pJS.particles.array[i].color.value = color[0];
            pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[0]);
          } else {
            pJSDom[0].pJS.particles.array[i].color.value = color[1];
            pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[1]);
          }
        })
      }

    })
  });
})();
