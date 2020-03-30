(function () {
    'use strict';
    $(() => {
        $.ajax({
            url: 'assets/php/connected.php',
            method: 'get',
        }).done(function (data) {
            if (data.success) {
                $('#disconnect, #connectedusers, #local, #name, #scoreboard').show();
                $('#connexion, #inscription').remove();
                connected();
            } else {
                $('#disconnect, #connectedusers, #name, #scoreboard').remove();
                $('#connexion, #inscription, #local').show();
                $('#messages').html(data.message).fadeIn();
            }
        }).fail(function () {
            $('body').html('Fatal error');
        });
        $('#form-params').on('submit', function () {
            $('#messages').fadeOut();
            $.ajax({
                url: $(this).attr('action'),
                method: $(this).attr('method'),
                data: $(this).serialize()
            }).done(function (data) {
                if (data.success === true) {
                    //window.location.href = '/';
                    window.location.href = '/JS/AjaxLOG/game.html';
                } else {
                    $('#messages').html(data.message).fadeIn();
                }
            }).fail(function () {
                $('body').html('Fatal error');
            });
            return false;
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

        $('#connectedusers > header').css('color', HextoRGBA(1, color, 1));
        for (var i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].title == 'styles') {
                document.styleSheets[i].addRule("::-webkit-scrollbar-thumb", 'background-color: ' + color[1]);
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
          console.log("event.target.id = " + event.target.id);
          console.log("this.id = " + this.id );
          console.log($(this));

          if (event.target.id != "inscription" && event.target.id != "local" && event.target.id != "connexion" && this.id != "params" && this.id != "navusers") {
                changecolorCookie();
                $('#form-params > input:checked + label').css('background-color', HextoRGBA(0.5, color, 1));
                $('#name > span').css('color', HextoRGBA(1, color, 0));
                for (var i = 0; i < document.styleSheets.length; i++) {
                    if (document.styleSheets[i].title == 'style') {
                        document.styleSheets[i].addRule("::-webkit-scrollbar-thumb", 'background-color: ' + color[1]);
                        break;
                    }
                }

                $('#connectedusers > header').css('color', HextoRGBA(1, color, 1));
                for (var i = 0; $('#user' + i).val() != null; i++) {
                    if (i % 2 == 0) $('#user' + i).css('color', color[0]);
                    else $('#user' + i).css('color', color[1]);
                }

                $('#inscription').css({
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

                $('#connexion').css({
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
