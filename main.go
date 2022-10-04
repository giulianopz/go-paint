package main

import (
	"log"
	"net/http"

	"go/paint/internal/handler"
	"go/paint/internal/model"
)

func main() {

	pool := model.NewPool()
	go pool.Start()

	http.HandleFunc("/eventbus", func(w http.ResponseWriter, r *http.Request) {
		handler.ServeWs(pool, w, r)
	})

	fs := http.FileServer(http.Dir("./api"))
	http.Handle("/", fs)

	log.Println("Serving at localhost:8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
