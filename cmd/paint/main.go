package main

import (
	"log"
	"net/http"

	"github.com/igm/sockjs-go/v3/sockjs"
)

func main() {

	handler := sockjs.NewHandler("/eventbus", sockjs.DefaultOptions, func(session sockjs.Session) {
		for {
			if msg, err := session.Recv(); err == nil {
				if session.Send(msg) != nil {
					break
				}
			} else {
				break
			}
		}
	})
	http.Handle("/eventbus/", handler)

	fs := http.FileServer(http.Dir("../../web"))
	http.Handle("/", fs)

	log.Println("Serving at localhost:8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func echoHandler(session sockjs.Session) {
	for {
		if msg, err := session.Recv(); err == nil {
			session.Send(msg)
			continue
		}
		break
	}
}
