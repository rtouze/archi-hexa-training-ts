import fastify from "fastify"
import pg from "@fastify/postgres"
import webapp from "./webapp"

const server = webapp({ logger: true })

server.register(pg, {
  connectionString: "postgres://enslipch:secret@localhost:7777/enslipch",
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
