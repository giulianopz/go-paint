# Go collaborative paint

Simple collaborative paint application using `gorilla/websocket` with the help of goroutines and channels.

Allows multiple users to draw on a shared canvas.

The FE part is based on a good canvas tutorial of [William Malone](http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/).

The BE part was forked from the Java (+ Vert.x) implementation of [Tomasz Kucharzyk](https://github.com/shardis/vertx-paint) and ported to Go(lang).

### Clone

```bash
git clone https://github.com/giulianopz/vertx-paint.git
```

### Build & Run

```bash
# build and run the executable
go19 build -o gopaint . && ./gopaint
# or simply run the main entrypoint from the project root
go run .
``` 

The app can be then accessed at: http://localhost:8080/

Open it from more than one browser tabs to test the synchronization across multiple clients.
