import fastify from "fastify"
import routesPanier from "./infra/routes/panier"
import routesCatalogue from "./infra/routes/catalogue"

export default function build(opts={}) {
    const app = fastify(opts)
    app.register(routesPanier)
    app.register(routesCatalogue)
    return app
}
