import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

type CreatePanierRequestBody = {
  reference: string
  quantity: number
}

export default async function routesPanier(
  fastify: FastifyInstance,
  options: any,
) {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({ hello: "panier" })
  })

  fastify.post<{ Body: CreatePanierRequestBody }>(
    "/panier",
    async (request, reply) => {
      request.log.info({ body: request.body })
      reply.status(200).send({ panier: "piano" })
    },
  )
}
