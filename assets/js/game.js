(function () {
  'use strict';
  document.body.style.cursor = "wait";
  var score = [0, 0];
  var joueur = ["X", "O"];
  var cpt = 0;
  var turn = 1;
  var effects = ["blind", "clip", "drop"];
  var bothconnected = false;

  var css_child = {
    height: "150px",
    width: "150px",
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    "text-align": "center",
    "z-index": "1"
  };

  var css_cell = {
    width: "150px",
    height: "150px",
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
        if (data.bothconnected) {
          bothconnected = true;
          $('#damier').show().css("display", 'flex');
          $('#player1, #player2').show()
          $("#gamemessage").css({
            "position": "absolute",
            "top": "85%"
          });
          if (data.turn == 1) turn = 1;
          else turn = 0;
          if (turn) $("#gamemessage").css("color", color[1]);
          else $("#gamemessage").css("color", color[0]);
          updateBoard(data);
        } else {
          $('#damier').hide();
        }
        setTimeout(() => {
          gameconnected();
        }, 1000);
      } else {
        $('#player1, #player2, #damier').hide();
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
    console.log(databoard.players);
    $('#player1').html(databoard.players[0] + "</br></br>" + "<span style='color: white'>" + databoard.players[2] + "</span>");
    $('#player2').html(databoard.players[1] + "</br></br>" + "<span style='color: white'>" + databoard.players[3] + "</span>");
  }

  function css_joueur(color) {
    return {
      "text-shadow": "0 0 5px " + color + ", 0 0 10px " + color + ", 0 0 15px " + color + ", 0 0 20px " + color + ", 0 0 30px " + color + ", 0 0 40px " + color + ", 0 0 55px " + color
    };
  }

  $.fn.FBD = function (prop, val) {
    return this.filter(function () {
      return $(this).data(prop) == val;
    });
  };

  function createBoard() {
    for (let y = 0; y < 3; y++) {
      let line = $("<div></div>");
      for (let x = 0; x < 3; x++) {
        let cell = $('<div class="cell"><div>&nbsp</div></div>').css(css_cell);
        cell.data("x", x);
        cell.data("y", y);
        cell.data("clicked", 0);
        cell.data("draw", 0);

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
          if (!$(this).data("clicked")) {
            cpt += 1;
            $(this).stop().children().html(joueur[turn]).css("color", "#FFF");
            $(this).children().css(css_joueur(color[turn]));
            $(this).data("clicked", 1);

            if (victory()) {
              $(".cell").data("clicked", 1);
              cpt = 0;
              setTimeout(() => {
                $("#damier").effect(effects[Math.floor(Math.random() * effects.length)], 500);
                setTimeout(() => {
                  $(".cell").children().html("&nbsp");
                  $(".cell").data("clicked", 0);
                  $("#damier").css("display", 'flex');
                  $(".cell").children().css(css_child);
                  cpt = 0;
                }, 1000);
              }, 250);
            }

            turn ? turn = 0 : turn = 1;

            if (cpt == 9) {
              cpt = 0;
              $(".cell").children().css(css_joueur("#ff0000"));
              $("#gamemessage").children().css(css_joueur("#ff0000"));
              $(".cell").children().css("color", "white");
              $(".cell").data("draw", 1);

              $.each(pJSDom[0].pJS.particles.array, function (i, p) {
                pJSDom[0].pJS.particles.array[i].color.value = '#ff0000';
                pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb('#ff0000');
              });

              setTimeout(() => {
                $("#damier").effect("shake", 500);
                setTimeout(() => {
                  $(".cell").children().html("&nbsp");
                  $(".cell").data("clicked", 0);
                  $(".cell").children().removeAttr("style").hide().fadeIn({
                    duration: 250,
                    specialEasing: {
                      fadeIn: "easeOutCubic"
                    }
                  });
                  $("#damier").css("display", 'flex');
                  $(".cell").data("draw", 0);
                  $(".cell").children().css(css_child);
                  $("#" + joueur[0]).css(css_joueur(color[0]));
                  $("#" + joueur[1]).css(css_joueur(color[1]));
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
            }
          }
        }); //cell.click
        line.append(cell);
      }
      $('#damier').append(line);
      //$("#gamemessage").html("<div id='" + joueur[0] + "'>" + joueur[0] + "</div>&nbsp:&nbsp<div id='" + joueur[1] + "'>" + joueur[1] + "</div>")
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

    $("#player1").css("color", color[1]);
    $("#player2").css("color", color[0]);


    $('#disconnect').click(() => {
      $.ajax({
        url: 'assets/php/logout.php',
        method: 'get'
      }).done(function () {
        window.location.href = 'index.html';
      });
    })


    $("div").click(function (event) {
      if (event.target.id != "inscription" && event.target.id != "local" && event.target.id != "connexion" && !$(event.target).is("button")) {
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
          if (turn) $("#gamemessage").css("color", color[1]);
          else $("#gamemessage").css("color", color[0]);
        }
        $("#player1").css("color", color[1]);
        $("#player2").css("color", color[0]);
      }
    })
  });
})();
