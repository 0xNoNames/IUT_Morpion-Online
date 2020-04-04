(function () {
  'use strict';
  $(() => {
    $.ajax({
      url: 'assets/php/connected.php',
      method: 'get',
    }).done(function (data) {
      if (data.success) {
        window.location.href = '/JS/AjaxLOG';
      }
    }).fail(function () {
      $('body').css({
        'color': 'white',
        'font-size': '25px'
      }).html('Fatal error at connected.php from login.js ajax');
    });

    $('#form-login').on('submit', function () {
      $.ajax({
        url: $(this).attr('action'),
        method: $(this).attr('method'),
        data: $(this).serialize()
      }).done(function (data) {
        if (data.success === true) {
          //window.location.href = '/';
          window.location.href = '/JS/AjaxLOG';
        } else {
          $('#messages').finish().hide().html(data.message).fadeIn();
        }
        $('input[type="password"]').val('');
      }).fail(function () {
        $('body').css({
          'color': 'white',
          'font-size': '25px'
        }).html('Fatal error at login.php from login.js ajax');
      });
      return false;
    });
  })
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

    $('#home').click(() => {
      window.location = 'index.html';
    });

    $('#loginbutton').css({
      'background-color': HextoRGBA(0.5, color, 1),
      'box-shadow': boxShadow(HextoRGBA(0.1, color, 1))
    }).hover(() => {
      $('#loginbutton').css({
        'background-color': HextoRGBA(0.75, color, 1),
        'box-shadow': boxShadow(HextoRGBA(0.25, color, 1))
      });
    }, () => {
      $('#loginbutton').css({
        'background-color': HextoRGBA(0.5, color, 1),
        'box-shadow': boxShadow(HextoRGBA(0.1, color, 1))
      });
    });

    $("div").click(function (event) {

      if (event.target.id != "pannel") {
        changecolorCookie();
        $('#loginbutton').css({
          'background-color': HextoRGBA(0.5, color, 1),
          'box-shadow': boxShadow(HextoRGBA(0.1, color, 1))
        }).hover(() => {
          $('#loginbutton').css({
            'background-color': HextoRGBA(0.75, color, 1),
            'box-shadow': boxShadow(HextoRGBA(0.25, color, 1))
          });
        }, () => {
          $('#loginbutton').css({
            'background-color': HextoRGBA(0.5, color, 1),
            'box-shadow': boxShadow(HextoRGBA(0.1, color, 1))
          });
        });
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
    });
  })
})();
