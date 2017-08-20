$(function () {

    var eb = new EventBus('/eventbus/');

    eb.onopen = function () {

        var canvasDiv = document.getElementById('canvasDiv');
        var canvas = document.createElement('canvas');
        canvas.setAttribute('width', 800);
        canvas.setAttribute('height', 600);
        canvas.setAttribute('id', 'canvas');
        canvasDiv.appendChild(canvas);
        if (typeof G_vmlCanvasManager !== 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        context = canvas.getContext("2d");

        var paint;

        var clickX = [];
        var clickY = [];
        var clickDrag = [];


        var redraw = function () {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            context.strokeStyle = $('#penColor').val();
            context.lineJoin = 'round';
            context.lineWidth = 5;

            for (var i = 0; i < clickX.length; i++) {
                context.beginPath();
                if (clickDrag[i] && i) {
                    context.moveTo(clickX[i - 1], clickY[i - 1]);
                } else {
                    context.moveTo(clickX[i] - 1, clickY[i]);
                }
                context.lineTo(clickX[i], clickY[i]);
                context.closePath();
                context.stroke();
            }
        };

        var processClick = function (x, y, dragging) {
            clickX.push(x);
            clickY.push(y);
            clickDrag.push(dragging);
        };

        var addClick = function (x, y, dragging) {
            processClick(x, y, dragging);
            eb.publish("client.paint", {x: x, y: y, dragging: dragging});
        };

        $(canvas).mousedown(function (e) {
            paint = true;
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
            redraw();
        });

        $(canvas).mousemove(function (e) {
            if (paint) {
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                redraw();
            }
        });

        $(canvas).mouseup(function (e) {
            paint = false;
        });


        eb.registerHandler('client.paint', function (err, msg) {
            processClick(msg.body.x, msg.body.y, msg.body.dragging);
            redraw();
        });

        console.log('Application is running');
    };


});
