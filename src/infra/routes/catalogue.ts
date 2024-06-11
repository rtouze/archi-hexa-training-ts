import { FastifyInstance, FastifyReply, FastifyRequest, FastifyHttpOptions } from "fastify"
import {CatalogueDB} from "../catalogue"

export default async function routesCatalogue(
  fastify: FastifyInstance,
  options: any,
  done: any
) {
  fastify.get("/catalogue", async (request: FastifyRequest, reply: FastifyReply) => {
    console.log(fastify.pg)
    const catalogue = new CatalogueDB(await fastify.pg.connect())
    reply.send({data: await catalogue.afficher()})
  })
  done()
}
