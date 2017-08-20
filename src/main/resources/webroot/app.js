$(function () {

    var clientUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (a, b) {
        b = Math.random() * 16;
        return (a === 'y' ? b & 3 | 8 : b | 0).toString(16);
    });

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

        var state = {};


        var redraw = function () {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            context.lineJoin = 'round';
            context.lineWidth = 5;

            var clients = Object.keys(state);
            clients.forEach(function (client) {
                var clientState = state[client];

                for (var i = 0; i < clientState.clickX.length; i++) {
                    context.strokeStyle = clientState.colors[i];
                    context.lineWidth = clientState.sizes[i];
                    context.beginPath();
                    if (clientState.clickDrag[i] && i) {
                        context.moveTo(clientState.clickX[i - 1], clientState.clickY[i - 1]);
                    } else {
                        context.moveTo(clientState.clickX[i] - 1, clientState.clickY[i]);
                    }
                    context.lineTo(clientState.clickX[i], clientState.clickY[i]);
                    context.closePath();
                    context.stroke();
                }
            });


        };

        var processClick = function (uuid, x, y, dragging, color, size) {
            if (!state[uuid]) {
                state[uuid] = {
                    clickX: [],
                    clickY: [],
                    clickDrag: [],
                    colors: [],
                    sizes: []
                };
            }
            state[uuid].clickX.push(x);
            state[uuid].clickY.push(y);
            state[uuid].clickDrag.push(dragging);
            state[uuid].colors.push(color);
            state[uuid].sizes.push(size);
        };

        var addClick = function (x, y, dragging) {
            var color = $('#penColor').val();
            var size = $('#penSize').val();
            processClick(clientUUID, x, y, dragging, color, size);
            eb.publish("client.paint", {uuid: clientUUID, x: x, y: y, dragging: dragging, color: color, size: size});
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

        $('#clear').click(function (e) {
            state = {};
            redraw();
        });


        eb.registerHandler('client.paint', function (err, msg) {
            processClick(msg.body.uuid, msg.body.x, msg.body.y, msg.body.dragging, msg.body.color, msg.body.size);
            redraw();
        });

        console.log('Application is running', clientUUID);
    };


});
