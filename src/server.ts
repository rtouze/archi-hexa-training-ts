import fastify from "fastify"
import routesPanier from "./infra/routes/panier"
import pg from "@fastify/postgres"

const server = fastify({ logger: true })

server.register(pg, {
  connectionString: "postgres://enslipch:enslipch@localhost:7777/enslipch",
})
server.register(routesPanier)

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
