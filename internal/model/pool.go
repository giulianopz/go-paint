package model

import "fmt"

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true
			fmt.Println("a new client joined: " + client.ID)
			fmt.Println("size of connection pool: ", len(pool.Clients))
		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			fmt.Println("a client left: " + client.ID)
			fmt.Println("size of connection pool: ", len(pool.Clients))
		case message := <-pool.Broadcast:
			fmt.Println("sending message to all clients in pool...")
			for client := range pool.Clients {
				if err := client.Conn.WriteMessage(message.Type, []byte(message.Body)); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
}
