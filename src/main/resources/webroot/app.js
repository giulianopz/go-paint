$(function () {

    var eb = new EventBus('/eventbus/');

    eb.onopen = function () {

        var canvasDiv = document.getElementById('canvasDiv');

        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', 800);
        canvas.setAttribute('height', 600);
        canvas.setAttribute('id', 'canvas');
        canvasDiv.appendChild(canvas);

        var context = canvas.getContext("2d");

        var paint = false;
        var lastX = null;
        var lastY = null;

        var processClick = function (x, y, prevX, prevY, dragging, color, size) {
            context.lineJoin = 'round';
            context.lineWidth = 5;

            context.strokeStyle = color;
            context.lineWidth = size;
            context.beginPath();
            if (dragging && prevX !== null && prevY !== null) {
                context.moveTo(prevX, prevY);
            } else {
                context.moveTo(x - 1, y);
            }
            context.lineTo(x, y);
            context.closePath();
            context.stroke();
        };

        var addClick = function (x, y, dragging) {
            var color = $('#penColor').val();
            var size = $('#penSize').val();
            eb.publish("client.paint", {
                x: x,
                y: y,
                prevX: lastX,
                prevY: lastY,
                dragging: dragging,
                color: color,
                size: size
            });
            lastX = x;
            lastY = y;
        };

        $(canvas).mousedown(function (e) {
            paint = true;
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        });

        $(canvas).mousemove(function (e) {
            if (paint) {
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            }
        });

        $(canvas).mouseup(function (e) {
            paint = false;
        });

        $('#clear').click(function (e) {
            eb.publish('client.paint.clear', {});
        });


        eb.registerHandler('client.paint', function (err, msg) {
            processClick(msg.body.x, msg.body.y, msg.body.prevX, msg.body.prevY, msg.body.dragging, msg.body.color, msg.body.size);
        });

        eb.registerHandler('client.paint.clear', function (err, msg) {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        });

    };


});