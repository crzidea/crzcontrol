$(function () {
    var socket = io.connect();
    socket.emit('login', {
        from: 'web',
        user: window.user
    })
    socket.on('loginSuccess', function (data) {
        write(data.msg);
    });

    socket.on('cmdComplete', function (data) {
        write(data.msg);
    });

    // bind enter to #command
    $("#command").keypress(function (event) {
        if (event.keyCode == 13) {
            event.cancelBubble = true;
            event.returnValue = false;
            $('#sendCmd').click();
        }
    });

    $('#sendCmd').click(function () {
        sendCommand($('#command').val());
    });

    $('.controller').click(function () {
        var cmdMsg = {
            from: 'web',
            to: 'pc',
            user: window.user,
            msg: 'control://' + this.name,
            value: getOpt(this)
        };
        socket.emit('command', cmdMsg);
    });
    $('input[name=brightness]').click(function () {
        var cmdMsg = {
            from: 'web',
            to: 'pc',
            user: window.user,
            msg: 'control://brightness'
        };
        if (typeof (brightness) == 'undefined') {
            brightness = 13;
        } else if (brightness < 3) {
            brightness = 3;
        } else if (brightness > 44) {
            brightness = 44;
        }
        switch (getOpt(this)) {
            case 'up':
                brightness -= 5;
                break;
            case 'down':
                brightness += 5;
                break;
        }
        cmdMsg.value = brightness;
        socket.emit('command', cmdMsg);
    });
    $('input[name=shutDown]').click(function () {
        var opt = $(this).attr('data-opt');
        var cmd;
        if (opt == 'h') {
            cmd = 'shutdown -h'
        } else {
            cmd = 'shutdown -' + opt + ' -t 0';
        }
        sendCommand(cmd);
    });
    $('input[name=ipInfo]').click(function () {
        sendCommand('ipconfig');
    });
    $('input[name=sysver]').click(function () {
        sendCommand('ver');
    });
    $('#sendCtrl').click(function () {
        console.log($('#command').val());
        socket.emit('command', {
            from: 'web',
            to: 'pc',
            user: window.user,
            value: $('#value').val(),
            msg: 'control://' + $('input[name=ctrlType]').val()
        });
    });

    function sendCommand(cmd) {
        socket.emit('command', {
            from: 'web',
            to: 'pc',
            user: window.user,
            msg: 'command://' + cmd
        })
    }

    function sendControl(ctrl) {
        socket.emit('command', {
            from: 'web',
            to: 'pc',
            user: window.user,
            msg: 'control://' + ctrl
        })
    }

    function write(html) {
        if (!html) return;

        if (html.indexOf('\n') > 0) {
            html = '<pre>' + html + '</pre>';
        }
        $('#recv').prepend('<hr/>' + html);
    }

    function getOpt(elem) {
        return $(elem).attr('data-opt');
    }
});