import fastify from "fastify"
import RoutePanier from "./infra/routes/panier"
import routesCatalogue from "./infra/routes/catalogue"
import { UtiliserPanier} from "./metier/usecases/utiliserpanier"
import { CatalogueDB } from "./infra/catalogue"
import {PanierRepositoryDb} from './infra/panier'
import pg from "@fastify/postgres"

export default async function build(opts={}) {
    const app = fastify(opts)

    app.register(pg, {
      connectionString: "postgres://enslipch:secret@localhost:7777/enslipch",
    })

    const pgc = await app.pg.connect()
    const catalogue = new CatalogueDB(pgc)
    // const panierRepository = new PanierRepositoryDb(pgc) 

    // new RoutePanier(app, new UtiliserPanier(panierRepository, catalogue)).run()
    // app.register(new RoutePanier)
    app.register(routesCatalogue)
    return app
}
