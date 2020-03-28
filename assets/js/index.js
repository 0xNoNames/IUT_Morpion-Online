(function () {
    'use strict';

    function Connected() {
        var Client = Client || {};
        Client.Pulse = null;

        $.ajax({
            url: 'assets/php/connected.php',
            type: 'get',
            dataType: 'json',
            success: function (parsed) {
                Client.RenderActiveUsers(parsed.logged);
                Client.Pulse = setTimeout(function () {
                    Connected();
                }, 10000); //10 second delay before next trigger
            } //success
        }); //$.ajax
        Client.RenderActiveUsers = function (parsed) {
            if (parsed != 0) {
                $('#navusers').show();
                $('#connectedusers > header').html("Utlisateurs connectés :");
                $('#connectedusers > div > nav').html("");
                for (var i = 0; i < parsed.length; i++) {
                    $('#connectedusers > div > nav').append('<ul id="' + i + '">' + parsed[i][0] + '</ul>')
                    if (parsed[i][1]) {
                        $('#connectedusers > div > nav > #' + i).css('color', "rgb(0,255,0)")/*.hover(function () {
                            $(this).css('background-color', 'rgba(255, 255, 0, 0.25)');
                        }, function () {
                            $(this).css('background-color', 'transparent');
                        })*/
                    } else {
                        $('#connectedusers > div > nav > #' + i).css('color', "rgb(255,0,0)")/*.hover(function () {
                            $(this).css('background-color', 'rgba(255, 0, 0, 0.25)');
                        }, function () {
                            $(this).css('background-color', 'transparent');
                        }) //.click( lancer la partie)*/
                    }
                }
            } else {
                $('#navusers').hide();
                $('#connectedusers > header').html("Pas d'utilisateur connecté");
            }
        }
    } //RenderActiveUsers
    $(() => {
        $.ajax({
            url: 'assets/php/is_connected.php',
            method: 'get',
        }).done(function (data) {
            if (data.success) {
                $('#name > span').html(data.username);
                $('#logoutbutton, #connectedusers, #local, #name').show();
                $('#connexion, #inscription').hide();
                Connected();
            } else {
                $('#logoutbutton, #connectedusers').hide();
                $('#connexion, #inscription, #local').show();
                $('#messages').html(data.message).fadeIn();
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

            $('#name > span').css('color', colorButton(1, color, 0));
            $('#connectedusers > header').css('color', colorButton(1, color, 1));

            $('#inscription').css('background-color', colorButton(0.5, color, 0)).click(() => {
                window.location = 'register.html';
            }).hover(() => {
                $('#inscription').css('background-color', colorButton(0.75, color, 0));
            }, () => {
                $('#inscription').css('background-color', colorButton(0.5, color, 0));
            });

            $('#connexion').css('background-color', colorButton(0.5, color, 1)).click(() => {
                window.location = 'login.html';
            }).hover(() => {
                $('#connexion').css('background-color', colorButton(0.75, color, 1));
            }, () => {
                $('#connexion').css('background-color', colorButton(0.5, color, 1));
            });

            $('#local').click(() => {
                window.location = 'local.html';
            });

            $('#logoutbutton').click(() => {
                $.ajax({
                    url: 'assets/php/logout.php',
                    method: 'get'
                }).done(function () {
                    window.location.href = 'index.html';
                });
            })

            $("div").click(function (event) {
                if (event.target.id != "inscription" && event.target.id != "local" && event.target.id != "connexion") {
                    color = [getColor(), getColor()];
                    $('#name > span').css('color', colorButton(1, color, 0));
                    $('#connectedusers > header').css('color', colorButton(1, color, 1));

                    $('#inscription').css('background-color', colorButton(0.5, color, 0)).hover(() => {
                        $('#inscription').css('background-color', colorButton(0.75, color, 0));
                    }, () => {
                        $('#inscription').css('background-color', colorButton(0.5, color, 0));
                    });
                    ;
                    $('#connexion').css('background-color', colorButton(0.5, color, 1)).hover(() => {
                        $('#connexion').css('background-color', colorButton(0.75, color, 1));
                    }, () => {
                        $('#connexion').css('background-color', colorButton(0.5, 1));
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
    })
})();
