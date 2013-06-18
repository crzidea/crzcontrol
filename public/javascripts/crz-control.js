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
    $("#command").keypress(function (e) {
        if (event.keyCode == 13) {
            event.cancelBubble = true;
            event.returnValue = false;
            $('#sendBtn').click();
        }
    });

    $('#sendCmd').click(function () {
        socket.emit('command', {
            from: 'web',
            to: 'pc',
            user: window.user,
            msg: 'command://' + $('#command').val()
        });
    });

    $("#value").keypress(function (e) {
        if (event.keyCode == 13) {
            event.cancelBubble = true;
            event.returnValue = false;
            $('#sendBtn').click();
        }
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


    function write(html) {
        if (html.indexOf('\n') > 0) {
            html = '<pre>' + html + '</pre>';
        }
        $('#recv').prepend('<hr/>' + html);
    }
});