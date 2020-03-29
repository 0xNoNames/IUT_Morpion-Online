(function () {
    'use strict';
    var color = [getColor(), getColor()];


    function paramsGame(user) {
        $('#pannel, #name, #connectedusers, #logoutbutton').hide();
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
        $('#paramSendButton').css('background-color', colorButton(0.5, color, 0)).hover(() => {
            $('#paramSendButton').css('background-color', colorButton(0.75, color, 0));
        }, () => {
            $('#paramSendButton').css('background-color', colorButton(0.5, color, 0));
        });
        $('#form-params > input:checked + label').css('background-color', colorButton(0.5, color, 1));

        $('body').append("<button id=\"home\">Accueil</button>");
        $('#home').click(function () {
                $('#params').empty().hide();
                $('#home').remove();
                $('#pannel, #name, #connectedusers, #logoutbutton').show();
            }
        )
    }

    function showUsers(parsed) {
        if (parsed != 0) {
            $('#navusers').show();
            $('#connectedusers > header').html("Utlisateurs connectés :");
            $('#connectedusers > div > nav').html("");
            for (var i = 0; i < parsed.length; i++) {
                $('#connectedusers > div > nav').append('<ul id="' + i + '">' + parsed[i][0] + '</ul>')
                if (parsed[i][1]) {
                    $('#connectedusers > div > nav > #' + i).css('color', "rgb(0,255,0)").click(function () {
                        paramsGame($(this).html());
                    });
                } else {
                    $('#connectedusers > div > nav > #' + i).css('color', "rgb(255,0,0)")
                }
            }
        } else {
            $('#navusers').hide();
            $('#connectedusers > header').html("Pas d'utilisateurs connectés");
        }
    }

    function Connected() {
        $.ajax({
            url: 'assets/php/connected.php',
            type: 'get',
            dataType: 'json',
            success: function (parsed) {
                showUsers(parsed.logged);
                var connectedTimeout = setTimeout(function () {
                    Connected();
                }, 5000);
            }
        });
    }

    $(() => {
        $.ajax({
            url: 'assets/php/is_connected.php',
            method: 'get',
        }).done(function (data) {
            if (data.success) {
                $('#name > span').html(data.username);
                $('#logoutbutton, #connectedusers, #local, #name').show();
                $('#connexion, #inscription').remove();
                Connected();
            } else {
                $('#logoutbutton, #connectedusers, #name').remove();
                $('#connexion, #inscription, #local').show();
                $('#messages').html(data.message).fadeIn();
            }
        }).fail(function () {
            $('body').html('Fatal error');
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

            $('#params').click(function () {
                $('#form-params > input + label').css('background-color', 'rgba(255, 255, 255, 0.3)');
                $('#form-params > input:checked + label').css('background-color', colorButton(0.5, color, 1));
            });


            $("div").click(function (event) {
                if (event.target.id != "inscription" && event.target.id != "local" && event.target.id != "connexion" && this.id != "params" && this.id != "connectedusers" && this.id != "navusers") {
                    color = [getColor(), getColor()];
                    $('#form-params > input:checked + label').css('background-color', colorButton(0.5, color, 1));
                    $('#name > span').css('color', colorButton(1, color, 0));
                    $('#connectedusers > header').css('color', colorButton(1, color, 1));

                    $('#inscription').css('background-color', colorButton(0.5, color, 0)).hover(() => {
                        $('#inscription').css('background-color', colorButton(0.75, color, 0));
                    }, () => {
                        $('#inscription').css('background-color', colorButton(0.5, color, 0));
                    });
                    $('#connexion').css('background-color', colorButton(0.5, color, 1)).hover(() => {
                        $('#connexion').css('background-color', colorButton(0.75, color, 1));
                    }, () => {
                        $('#connexion').css('background-color', colorButton(0.5, 1));
                    });

                    $('#paramSendButton').css('background-color', colorButton(0.5, color, 0)).hover(() => {
                        $('#paramSendButton').css('background-color', colorButton(0.75, color, 0));
                    }, () => {
                        $('#paramSendButton').css('background-color', colorButton(0.5, color, 0));
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
})
();
