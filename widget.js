//$('#soc_widget').addClass(Platform.any()[0]);


function Widget(config) {
    this.config = config || {};

    var body = $('body');
    var base = $('<div />', {
        id: 'soc_widget',
        'class': 'soc_widget',
        html: '<div class="inner"><div class="messengers" /></div><div class="triggers" /></div></div>'
    });

    var chat = this.config.chat
        ? $('<div>', {
            id: 'chat',
            'class': 'trg',
            html: $('<div />', {'class': 'icon', html: $('<span />', {'class': 'hint', text: 'Чат'})}),
            'data-background': '#ffc107',
            'data-hover': '#ffc107'
        })
        : '';

    var call = this.config.call
        ? $('<div>', {
            id: 'call',
            //'data-settings' :'{"type":"", "id": "MTAwMDQ4MDE=","autoDial" : "0", "lang" : "ru-ru", "host":"widgets.mango-office.ru/", "errorMessage": "� ������ ������ ����������� ����������� �������� � ���������� ������ ����������"}',
            'class': 'trg',
            html: $('<div />', {'class': 'icon', html: $('<span />', {'class': 'hint', text: 'Заказать звонок'})}),
            'data-background': '#FF5722',
            'data-hover': '#FF5722'
        })
        : '';

    var messengersTrigger = this.config.messengers.enabled
        ? $('<div>', {
            id: 'trigger',
            'class': 'trg',
            html: $('<div />', {'class': 'icon', html: $('<span />', {'class': 'hint', text: 'Мессенджеры'})}),
            'data-background': '#2196F3',
            'data-hover': '#2196F3'
        })
        : '';

    var userInactivity = $('<span class="userinactivity">Есть вопросы? Задайте</span>');

    this.createMangoEnv = function () {
        !function (t) {
            function e() {
                i = document.querySelectorAll(".button-widget-open");
                for (var e = 0; e < i.length; e++) "true" != i[e].getAttribute("init") && (options = JSON.parse(i[e].closest('.' + t).getAttribute("data-settings")), i[e].setAttribute("onclick", "alert('" + options.errorMessage + "(0000)'); return false;"))
            }

            function o(t, e, o, n, i, r) {
                var s = document.createElement(t);
                for (var a in e) s.setAttribute(a, e[a]);
                s.readyState ? s.onreadystatechange = o : (s.onload = n, s.onerror = i), r(s)
            }

            function n() {
                for (var t = 0; t < i.length; t++) {
                    var e = i[t];
                    if ("true" != e.getAttribute("init")) {
                        options = JSON.parse(e.getAttribute("data-settings"));
                        var o = new MangoWidget({
                            host: window.location.protocol + '//' + options.host,
                            id: options.id,
                            elem: e,
                            message: options.errorMessage
                        });
                        o.initWidget(), e.setAttribute("init", "true"), i[t].setAttribute("onclick", "")
                    }
                }
            }

            host = window.location.protocol + "//widgets.mango-office.ru/";
            var i = document.getElementsByClassName(t);
            o("link", {rel: "stylesheet", type: "text/css", href: host + "css/widget-button.css"}, function () {
            }, function () {
            }, e, function (t) {
                document.documentElement.insertBefore(t, document.documentElement.firstChild)
            }), o("script", {type: "text/javascript", src: host + "widgets/mango-callback.js"}, function () {
                ("complete" == this.readyState || "loaded" == this.readyState) && n()
            }, n, e, function (t) {
                document.documentElement.appendChild(t)
            })
        }("mango-callback");
    }

    this.checkDeviceType = function () {
        var Platform = {
            Android: function () {
                return navigator.userAgent.match(/Android/i)
            },
            //iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
            iOS: function () {
                return navigator.userAgent.match(/iPhone/i)
            },
            any: function () {
                return (Platform.Android() || Platform.iOS());
            }
        };

        return Platform;
    }

    this.createBaseHtml = function () {
        body.append(base);
        base.children().append(userInactivity);
    }

    this.createTriggersHtml = function () {
        base.find('.triggers').append(chat);
        base.find('.triggers').append(call);
        base.find('.triggers').append(messengersTrigger);

        //base.find('#call').append(mangohtml);
    }

    this.createMessengersHtml = function () {
        var socials = this.config.messengers;
        delete socials.enabled;

        for (key in socials) {
            body.find('.messengers').append(
                $('<div />', {
                    'class': 'button ' + key,
                    'data-background': socials[key].background,
                    'data-hover': socials[key].hover,
                    'data-ico': key,
                    html: '<a href="' + socials[key].url + '" target="_blank"><div class="icon"></div><span class="hint">' + socials[key].text + '</span></a>'
                })
            ).addClass('inactive');
        }

        //body.find('.messengers').wrapInner('<div class="_inner"></div>');
    }

    this.applyStyles = function () {
        let triggers = base.find('.triggers').children('.trg');
        let messengers = base.find('.messengers').children('.button');
        let bodyHeight = $('body').outerHeight();

        setTimeout(function () {
            //debugger
            //$('#__threadswidget_chat__container iframe').height(bodyHeight);
        }, 1500)

        triggers.each(function (key, value) {
            var $elem = $(value);

            $elem.css({
                background: $elem.data('background')
            });
        });

        messengers.each(function (key, value) {
            var $elem = $(value);

            $elem.css({
                backgroundColor: $elem.data('background'),
                backgroundImage: 'url(/site-vidget2/' + $elem.data('ico') + '.svg)'
            });
        });

        //TODO: ������ ������������
        if ($('#soc_widget').hasClass('iPhone') || $('#soc_widget').hasClass('Android'))
            return;

        var widgetWidth = Object.keys(this.config).length * 50;
        base.find('.inner').width(widgetWidth);

        //base.addClass(this.checkDeviceType().any()[0]);

        this.userInactivity(); //334 38
    }

    this.userInactivity = function (event) {
        var button = base.find('.userinactivity');
        //var buttonWidth = button.width() - 34;
        var buttonWidth = button.width();

        setTimeout(function () {
            if (!sessionStorage.getItem('soc_widgets')) {
                base.addClass('brright');
                base.find('.inner').css('width', '+=' + buttonWidth);

                button.css({
                    borderLeftColor: $(base).find('.triggers .trg:first').data('background')
                }).show('slow')

            } else {
                button.hide();
                base.addClass('brevery');
            }
        }, 3000);
    }

    this.cycleIcons = function () {
        if (this.checkDeviceType().any() !== null || undefined) return;
        //if (this.checkDeviceType().any() == 'iPhone' || 'Android') {
        //	return
        //}

        var messengers = $('.messengers').children();
        var foo = [];

        for (var i = 0; i < messengers.length; i++) {
            var childElem = messengers[i];

            foo.push({
                ico: $(childElem).data('ico'),
                background: $(childElem).data('background'),
                hover: $(childElem).data('hover'),
                href: $(childElem).children('a').attr('href')
            });
        }

        // назначаем свойства кнопке-триггеру
        // если мессенджеров нет - скрываем кнопку-триггер
        // если мессенджер 1 - назначаем кнопке-триггеру цвета и иконки мессенджера
        // для 2 и более мессенджеров - запускам ротацию кнопок в теле кноки-триггера

        var index = 0;
        flag = false;
        var triggerMessenger = $('#trigger .icon');

        // ������ ������
        triggerMessenger.css({
            'background-color': foo[0].background,
            'background-image': 'url(/site-vidget2/' + foo[0].ico + '.svg)'
        });

        setInterval(function () {
            if (flag) return;

            triggerMessenger.css({
                'background-color': foo[index].background,
                'background-image': 'url(/site-vidget2/' + foo[index].ico + '.svg)'
            });

            index++;
            if (index >= foo.length) index = 0;
        }, 1000);
    }

    this.events = function () {
        var isMobile = this.checkDeviceType().any();

        setTimeout(function () {
            var overallHeight = parseInt(base.find('.messengers').innerHeight()) + parseInt(base.find('.triggers').innerHeight()) + 20;

            if (sessionStorage.getItem('soc_widgets') !== undefined && null) {
                $('.triggers').children().first().addClass('noborder');
            }

            $('body').on('click', '.mng-wgt .close-popup', function () {
                $('.soc_widget').removeClass('h');
            });

            if (!isMobile) {
                //debugger
                $('#trigger').hover(function () {
                    $(this).addClass('act');
                    $('.messengers').removeClass('inactive');
                    flag = true;
                });

                $('#call, #chat, .userinactivity').on('hover', function () {
                    $('.messengers').addClass('inactive');

                    flag = false;
                });

                $('.messengers').on('mouseleave', function () {
                    $(this).addClass('inactive');
                    $('#trigger').removeClass('act');
                    flag = false;
                });
                $('.messengers').on('mouseenter', function () {
                    flag = true;
                });
            }

            // прячем user-оповещение, показываем чат, пишем в сессию
            $('.userinactivity').on('click', function () {
                $(this).hide();
                $(this).addClass("viewed");
                base.removeClass('brright').addClass('brevery');
                sessionStorage.setItem('soc_widgets', true);

                $('#soc_widget').find('.inner').width(150);

                ThreadsWidget.showChat();
            });

            // триггерим чат
            $('#chat div').on('click', function () {
                ThreadsWidget.showChat();
            });

            // триггерим манго
            $('#call div').on('click', function () {
                $('#mango-widget-btn').trigger('click');
                $('#soc_widget').addClass('h');
            });

            $('#trigger').on('click', 'a', function (e) {
                e.preventDefault();
            });

            $('.mobileTrigger').on('click', function () {
                //$('.mobileFixedWall').toggle();

                //$('.messengers').css('opacity', 1);


                //if (!$(this).hasClass('sel')) {
                //	$(this).css('bottom', overallHeight);
                //	//document.getElementById('player').play();
                //} else {
                //	$(this).animate({
                //		bottom: 0
                //	}, 100);
                //	//document.getElementById('player2').play();
                //}

                if (!$(this).hasClass('sel')) {
                    $(this).prev().css({
                        'paddingBottom': 20
                    });
                    $(this).css('bottom', overallHeight);
                } else {
                    $(this).prev().css({
                        'paddingBottom': 0
                    });
                    $(this).css('bottom', 0);
                }


                $(this).toggleClass('sel');
                $('.messengers').toggleClass('inactive');

                //$('#player').play();

            });
        }, 1500);
    }

    this.mobileAdaptive = function () {
        if (this.checkDeviceType().any() !== null || undefined) {
            base.addClass(this.checkDeviceType().any()[0]);
            //base.find('.messengers').removeClass('inactive');

            base.append('<span class="mobileTrigger">Есть вопросы? Задайте</span>');
            //body.addClass('mobileWidget')
            //$('<div class="mobileFixedWall" />').before(base);
            //base.before('<div class="mobileFixedWall" />');

            var viewportWidth = $('table.main').Exists() ? 960 : '';
            //var overallHeight = base.find('.messengers').innerHeight() + base.find('.triggers').innerHeight();
            /**
             * считаем каждый раз величину viewport
             * кнопкам чата и звонку назначаем по половине от общей ширины
             * пропорционально задаем высоту
             */
            var buttons = $('#chat, #call');

            //base.find('.inner').width('100%');
            buttons.css({
                width: viewportWidth / 2,
                height: 40
            });

            base.find('.triggers').height(40);
            base.find('.triggers .icon').css({
                height: 40,
                backgroundSize: 30,
                margin: "2.5px auto 0 auto"
            });

            /** иконкам с мессенджерами задаем {высоту/ширину * viewport / ширину исходного макета}
             * аналогичным образом высчитываем отсутупы
             */
            var iconLength = Object.keys(this.config.messengers).length;
            var srcProps = 40;

            base.find('.button').css({
                width: 40,
                height: 40
            });

            base.find('.icon').css({
                width: 40,
                height: 40
            });

            /** создаем Только для мобильного режима кнопку - активитор
             * по тапу по специальной кнопке, раскрываем виджет
             *
             * выбеливаем фон, убираем скроллы
             */


            /** отключаем чат на мобиле
             *
             */
            $('#chat, #trigger').hide();
        }
    }

    this.init = function () {
        //this.createMangoEnv();
        this.checkDeviceType();
        this.createBaseHtml();
        this.createTriggersHtml();
        this.createMessengersHtml();
        this.cycleIcons();
        this.applyStyles();
        this.mobileAdaptive();
        this.events();
    }

    $.fn.Exists = function () {
        return this.length > 0;
    };

    this.init();
}