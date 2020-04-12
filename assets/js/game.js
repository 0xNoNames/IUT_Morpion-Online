(function () {
  'use strict';
  document.body.style.cursor = "wait";
  let score = [0, 0];
  let click = [0, 0];
  let joueur = ["X", "O"];
  let player = 0;
  let yourturn = 0;
  let effects = ["blind", "clip", "drop"];
  let bothconnected = false;
  let reset = false;

  let css_child = {
    height: "150px",
    width: "150px",
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    "text-align": "center",
    "z-index": "1"
  };

  function gameconnected() {
    document.body.style.cursor = "default";
    $.ajax({
      url: 'assets/php/game.php',
      method: 'get',
    }).done(function (data) {
      console.log(data);
      if (data.success) {
        $('#gamemessage').html(data.message);
        if (data.forfait) {
          $('#damier, #leave, #player1, #player2').hide();
          $("#gamemessage").css({
            'top': '50%',
            'color': 'white'
          });
          $('#player1').html(data.players[0] + "</br></br>" + "<span style='color: white'>" + data.players[2] + "</span>");
          $('#player2').html(data.players[1] + "</br></br>" + "<span style='color: white'>" + data.players[3] + "</span>");
          setTimeout(function () {
            setTimeout(function () {
              $.ajax({
                url: 'assets/php/game.php',
                method: 'post',
                data: {
                  remove: 1
                }
              }).done(function (data) {
                window.location.href = "/JS/AjaxLOG";
              }).fail(function (xhr, status, error) {
                console.log(xhr.responseText)
                $('body').css({
                  'color': 'white',
                  'font-size': '25px'
                }).html('Fatal error at game.php from gameconnected() ajax');
              });
            }, 2000);
          }, 2000);
        }
        if (data.bothconnected) {
          bothconnected = true;
          $('#damier').show().css("display", 'flex');
          $('#player1, #player2').show();
          $("#gamemessage").css({
            "position": "absolute",
            "top": "85%"
          });
          if (data.player == 1) player = 1;
          else player = 0;
          if (data.yourturn == 1) {
            $("#gamemessage").css("color", color[player]);
            yourturn = 1;
          } else {
            player ? $("#gamemessage").css("color", color[0]) : $("#gamemessage").css("color", color[1]);
            yourturn = 0;
          }
          if (data.victory) {
            $('#damier, #leave').hide();
            $("#gamemessage").css({
              'top': '50%',
              'color': 'white'
            });
            $('#player1').html(data.players[0] + "</br></br>" + "<span style='color: white'>" + data.players[2] + "</span>");
            $('#player2').html(data.players[1] + "</br></br>" + "<span style='color: white'>" + data.players[3] + "</span>");
            setTimeout(function () {
              $.ajax({
                url: 'assets/php/game.php',
                method: 'post',
                data: {
                  victory: 1
                }
              }).done(function (data) {
                console.log(data);
                window.location.href = "/JS/AjaxLOG";
              }).fail(function (xhr, status, error) {
                console.log(xhr.responseText)
                $('body').css({
                  'color': 'white',
                  'font-size': '25px'
                }).html('Fatal error at game.php from gameconnected() ajax');
              });
            }, 2000);
          } else updateBoard(data);
          $('#leave').html('Forfait').css('top', '10%').show()
        } else {
          bothconnected = false;
          $('#damier').hide();
          $("#gamemessage").css("color", "white");
          if (!data.forfait) $('#leave').html('Annuler').show();
        }
        setTimeout(() => {
          gameconnected();
        }, 1000);
      } else {
        $('#player1, #player2, #damier, #leave').hide();
        $('#gamemessage').html(data.message).css('top', '50%').fadeIn();
        document.body.style.cursor = "default";
        setTimeout(function () {
          window.location.href = "/JS/AjaxLOG";
        }, 2000);
      }
    }).fail(function (xhr, status, error) {
      console.log(xhr.responseText)
      $('body').css({
        'color': 'white',
        'font-size': '25px'
      }).html('Fatal error at game.php from gameconnected() ajax');
    });
  }

  $(() => {
    gameconnected();
    createBoard();
  });


  function updateBoard(databoard) {
    reset = databoard.reset;
    if (reset) {
      $('.cell').children().html("•").css(css_joueur("#ff0000"));
      $(".cell").children().css("color", "white");
      $.each(pJSDom[0].pJS.particles.array, function (i, p) {
        pJSDom[0].pJS.particles.array[i].color.value = '#ff0000';
        pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb('#ff0000');
      });

      setTimeout(() => {
        $("#damier").effect("shake", 400);
        setTimeout(() => {
          $(".cell").children().removeAttr("style").hide().fadeIn({
            duration: 250,
            specialEasing: {
              fadeIn: "easeOutCubic"
            }
          });
          $("#damier").css("display", 'flex');
          $(".cell").children().css(css_child);
          $.each(pJSDom[0].pJS.particles.array, function (i, p) {
            if (i < pJSDom[0].pJS.particles.array.length / 2) {
              pJSDom[0].pJS.particles.array[i].color.value = color[0];
              pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[0]);
            } else {
              pJSDom[0].pJS.particles.array[i].color.value = color[1];
              pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[1]);
            }
          });
        }, 1000);
      }, 200);
    } else {
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          $(".cell").FBD("y", y).FBD("x", x).children().html(databoard.board[x][y]);
        }
      }
    }
    $('#player1').html(databoard.players[0] + "</br></br>" + "<span style='color: white'>" + databoard.players[2] + "</span>");
    $('#player2').html(databoard.players[1] + "</br></br>" + "<span style='color: white'>" + databoard.players[3] + "</span>");
    $(".cell").data("clicked", 0);
    $(".cell:contains('X')").children().css(css_joueur(color[0]));
    $(".cell:contains('O')").children().css(css_joueur(color[1]));
    $(".cell:contains('O')").data("clicked", 1);
    $(".cell:contains('X')").data("clicked", 1);
  }

  function css_joueur(color) {
    return {
      "text-shadow": "0 0 5px " + color + ", 0 0 10px " + color + ", 0 0 15px " + color + ", 0 0 20px " + color + ", 0 0 30px " + color + ", 0 0 40px " + color + ", 0 0 55px " + color
    };
  }

  $.fn.FBD = function (data, val) {
    return this.filter(function () {
      return $(this).data(data) == val;
    });
  };

  function createBoard() {
    for (let y = 0; y < 3; y++) {
      let line = $("<div></div>");
      for (let x = 0; x < 3; x++) {
        let cell = $('<div class="cell"><div>&nbsp</div></div>');
        cell.data("x", x);
        cell.data("y", y);
        cell.data("clicked", 0);

        if (x == 0) {
          if (y in [0, 1]) {
            cell.css("border-right", "solid white");
          }
          cell.css("border-bottom", "solid white");
        } else if (x == 1) {
          if (y in [0, 1]) {
            cell.css("border-right", "solid white");
          }
          cell.css("border-bottom", "solid white");
        } else if (x == 2 && y in [0, 1]) {
          cell.css("border-right", "solid white");
        }

        cell.click(function () {
          click = [x, y];
          if (!$(this).data("clicked") && yourturn) {
            $(this).stop().children().html(joueur[player]);
            if (player == 1) {
              $(this).children().css(css_joueur(color[1]));
            } else {
              $(this).children().css(css_joueur(color[0]));
            }
            yourturn = 0;
            $(this).data("clicked", 1);
            $.ajax({
              url: 'assets/php/game.php',
              method: 'post',
              data: {
                click
              }
            }).done(function (data) {
              updateBoard(data);
            }).fail(function (xhr, status, error) {
              console.log(xhr.responseText)
              $('body').css({
                'color': 'white',
                'font-size': '25px'
              }).html('Fatal error at game.php from gameconnected() ajax');
            });
          }
        }); //cell.click
        line.append(cell);
      }
      $('#damier').append(line);
      $("#" + joueur[0]).css(css_joueur(color[0]));
      $("#" + joueur[1]).css(css_joueur(color[1]));
    }
    $(".cell").children().css(css_child);
  }

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

    $("#player1").css("color", color[0]);
    $("#player2").css("color", color[1]);


    $('#leave').click(() => {
      $.ajax({
        url: 'assets/php/game.php',
        method: 'post',
        data: {
          forfait: 1
        }
      }).done(function (data) {
        if (data.leave) {
          window.location.href = "/JS/AjaxLOG";
        }
      }).fail(function (xhr, status, error) {
        console.log(xhr.responseText)
        $('body').css({
          'color': 'white',
          'font-size': '25px'
        }).html('Fatal error at game.php from gameconnected() ajax');
      });;
    })

    $("div").click(function (event) {
      if (!reset) {
        if (this.id.toString() != "damier" && this.id.toString() != "" && !$(event.target).is("button")) {
          changecolorCookie();
          $.each(pJSDom[0].pJS.particles.array, function (i, p) {
            if (i < pJSDom[0].pJS.particles.array.length / 2) {
              pJSDom[0].pJS.particles.array[i].color.value = color[0];
              pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[0]);
            } else {
              pJSDom[0].pJS.particles.array[i].color.value = color[1];
              pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[1]);
            }
          })
          if (bothconnected) {
            $("#gamemessage").css("color", color[player]);
          }
          $("#player1").css("color", color[0]);
          $("#player2").css("color", color[1]);
          $(".cell:contains('X')").children().css(css_joueur(color[0]));
          $(".cell:contains('O')").children().css(css_joueur(color[1]));
        }
      }
    })
  });
})();
