// jshint esversion: 6
(function () {
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

    let score = [0, 0];
    let joueur = ["X", "O"];
    let cpt = 0;
    let turn = 0;
    let color = [getColor(), getColor()];
    let count = 0;

    let effects = ["blind", "clip", "drop"];

    let css_child = {
      height: "150px",
      width: "150px",
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
      "text-align": "center",
      "z-index": "1"
    };

    let css_particles = {
      position: "absolute",
      top: "0",
      left: "0",
      height: "100%",
      width: "100%",
      "z-index": "0"
    };

    let css_body = {
      display: "flex",
      "align-items": "center",
      "justify-content": "center",
      "flex-direction": "column",
      "min-height": "100vh",
      "background-color": "#000000",
      "font-family": "'Nunito', sans-serif",
      "line-height": '0.8',
      "font-size": "100px",
      "-webkit-touch-callout": "none",
      "-webkit-user-select": "none",
      "-khtml-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none"
    };

    let css_cell = {
      width: "150px",
      height: "150px",
      "z-index": "1"
    };

    let css_score = {
      color: "white",
      position: "absolute",
      display: "flex",
      top: "80%",
      height: '75px',
      "font-size": "100px",
      "z-index": "1"
    };

    let css_damier = {
      display: "inherit",
      "z-index": "1"
    };

    $("#particles-js").css(css_particles);
    $("#damier").css(css_damier);
    $("body").css(css_body);
    $("#score").html("<div id='" + joueur[0] + "'>" + joueur[0] + "</div>&nbsp:&nbsp<div id='" + joueur[1] + "'>" + joueur[1] + "</div>").css(css_score);
    $("#" + joueur[0]).css(css_joueur(color[0]));
    $("#" + joueur[1]).css(css_joueur(color[1]));

    function getColor() {
      h = (360 * Math.random()) / 360;
      s = 1;
      l = 0.5;
      let r,
        g,
        b;
      const hue2rgb = (p, q, t) => {
        if (t < 0)
          t += 1;
        if (t > 1)
          t -= 1;
        if (t < 1 / 6)
          return p + (q - p) * 6 * t;
        if (t < 1 / 2)
          return q;
        if (t < 2 / 3)
          return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ?
        l * (1 + s) :
        l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
      const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ?
          "0" + hex :
          hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

    function victory() {
      for (let a = 0; a < 3; ++a) {
        if ($(".cell").FBD("y", a).FBD("x", 0).children().html() == joueur[turn] && $(".cell").FBD("y", a).FBD("x", 1).children().html() == joueur[turn] && $(".cell").FBD("y", a).FBD("x", 2).children().html() == joueur[turn]) {
          $(".cell").FBD("y", a).children().css("color", color[turn]);
          $("#" + joueur[turn]).html(++score[turn]);
          turn ? $("#" + joueur[0]).html(score[0]) : $("#" + joueur[1]).html(score[1]);
          return true;
        } else
        if ($(".cell").FBD("y", 0).FBD("x", a).children().html() == joueur[turn] && $(".cell").FBD("y", 1).FBD("x", a).children().html() == joueur[turn] && $(".cell").FBD("y", 2).FBD("x", a).children().html() == joueur[turn]) {
          $(".cell").FBD("x", a).children().css("color", color[turn]);
          $("#" + joueur[turn]).html(++score[turn]);
          $("#" + joueur[!turn]).html(score[!turn]);
          turn ? $("#" + joueur[0]).html(score[0]) : $("#" + joueur[1]).html(score[1]);
          return true;
        }
      }
      if ($(".cell").FBD("y", 0).FBD("x", 0).children().html() == joueur[turn] && $(".cell").FBD("y", 1).FBD("x", 1).children().html() == joueur[turn] && $(".cell").FBD("y", 2).FBD("x", 2).children().html() == joueur[turn]) {
        $(".cell").FBD("y", 0).FBD("x", 0).children().css("color", color[turn]);
        $(".cell").FBD("y", 1).FBD("x", 1).children().css("color", color[turn]);
        $(".cell").FBD("y", 2).FBD("x", 2).children().css("color", color[turn]);
        $("#" + joueur[turn]).html(++score[turn]);
        $("#" + joueur[!turn]).html(score[!turn]);
        turn ? $("#" + joueur[0]).html(score[0]) : $("#" + joueur[1]).html(score[1]);
        return true;
      } else if ($(".cell").FBD("y", 0).FBD("x", 2).children().html() == joueur[turn] && $(".cell").FBD("y", 1).FBD("x", 1).children().html() == joueur[turn] && $(".cell").FBD("y", 2).FBD("x", 0).children().html() == joueur[turn]) {
        $(".cell").FBD("y", 0).FBD("x", 2).children().css("color", color[turn]);
        $(".cell").FBD("y", 1).FBD("x", 1).children().css("color", color[turn]);
        $(".cell").FBD("y", 2).FBD("x", 0).children().css("color", color[turn]);
        $("#" + joueur[turn]).html(++score[turn]);
        $("#" + joueur[!turn]).html(score[!turn]);
        turn ? $("#" + joueur[0]).html(score[0]) : $("#" + joueur[1]).html(score[1]);
        return true;
      }
    }

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
                  $("#damier").css(css_damier);
                  $(".cell").children().css(css_child);
                  cpt = 0;
                }, 1000);
              }, 250);
            }

            turn ? turn = 0 : turn = 1;

            if (cpt == 9) {
              cpt = 0;
              $(".cell").children().css(css_joueur("#ff0000"));
              $("#score").children().css(css_joueur("#ff0000"));
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
                  $("#damier").css(css_damier);
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
      $("#damier").append(line);
    }

    $("*").css({
      margin: "0",
      padding: "0",
      "box-sizing": "border-box"
    });
    $(".cell").children().css(css_child);

    $("div").click(function (event) {
      if (!$(".cell").data("draw")) {
        if (event.target.id == joueur[0] && $(this).attr("id") == "score") {
          color[0] = getColor();
          $("#" + joueur[0]).css(css_joueur(color[0]));
          $(".cell:contains('" + joueur[0] + "')").children().css(css_joueur(color[0]));
          $.each(pJSDom[0].pJS.particles.array, function (i, p) {
            if (i < pJSDom[0].pJS.particles.array.length / 2) {
              pJSDom[0].pJS.particles.array[i].color.value = color[0];
              pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[0]);
            }
          });
        } else if (event.target.id == joueur[1] && $(this).attr("id") == "score") {
          color[1] = getColor();
          $("#" + joueur[1]).css(css_joueur(color[1]));
          $(".cell:contains('" + joueur[1] + "')").children().css(css_joueur(color[1]));
          $.each(pJSDom[0].pJS.particles.array, function (i, p) {
            if (i > pJSDom[0].pJS.particles.array.length / 2) {
              pJSDom[0].pJS.particles.array[i].color.value = color[1];
              pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[1]);
            }
          });
        }
        if (this.id.toString() != "damier" && this.id.toString() != "" && !(event.target.id == joueur[0] || event.target.id == joueur[1])) {
          color = [getColor(), getColor()];
          $("#" + joueur[0]).css(css_joueur(color[0]));
          $("#" + joueur[1]).css(css_joueur(color[1]));
          $(".cell:contains('" + joueur[0] + "')").children().css(css_joueur(color[0]));
          $(".cell:contains('" + joueur[1] + "')").children().css(css_joueur(color[1]));
          $.each(pJSDom[0].pJS.particles.array, function (i, p) {
            if (i < pJSDom[0].pJS.particles.array.length / 2) {
              pJSDom[0].pJS.particles.array[i].color.value = color[0];
              pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[0]);
            } else {
              pJSDom[0].pJS.particles.array[i].color.value = color[1];
              pJSDom[0].pJS.particles.array[i].color.rgb = hexToRgb(color[1]);
            }
          });
        }
      }
    }); //document.click()

    $(".cell").hover(function () { // $(this).children().css('content', "'X'");
      if (!$(this).data("clicked")) {
        $(this).children().css(css_joueur(color[turn]));
        $(this).children().html(joueur[turn]).css("color", color[turn]).stop().hide().fadeIn({
          duration: 250,
          specialEasing: {
            fadeIn: "easeOutCubic"
          }
        });
      }
    }, function () {
      if (!$(this).data("clicked")) {
        $(this).children().stop().fadeOut({
          duration: 250,
          specialEasing: {
            fadeOut: "easeOutCubic"
          }
        });
        $(this).children().html("&nbsp");
      }
    }); //cell.over()
  });
})();
