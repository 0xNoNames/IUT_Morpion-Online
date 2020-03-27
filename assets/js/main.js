(function () {
  'use strict';
  $(() => {
    $.ajax({
      url: 'assets/php/is_connected.php',
      method: 'get',
    }).done(function (data) {
      if (data.success) {
        $('body').append(
          $('<button/>')
          .html('Déconnexion')
          .on('click', function () {
            $.ajax({
              url: 'assets/php/logout.php',
              method: 'get'
            }).done(function () {
              window.location.href = '../../index.html';
            });
          })
        );
      }
    }).fail(function () {
      $('body').html('Fatal error');
    });
    $(document).ready(function () {

      let color = [getColor(), getColor()];

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

      document.onclick(changeColor(pJSDom[0].pJS.particles.array));


    })
  })
})();
