package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/igm/sockjs-go/v3/sockjs"
)

func main() {

	handler := sockjs.NewHandler("/eventbus", sockjs.DefaultOptions, func(session sockjs.Session) {
		for {
			if msg, err := session.Recv(); err == nil {
				if err2 := session.Send(msg); err2 != nil {
					fmt.Println(time.Now(), msg)
					break
				} else {
					fmt.Println("ERR", time.Now(), err2)
				}
			} else {
				fmt.Println("ERR", time.Now(), err)
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
