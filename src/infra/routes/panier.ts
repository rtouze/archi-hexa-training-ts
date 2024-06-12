import { FastifyInstance, FastifyReply, FastifyRequest, FastifyHttpOptions } from "fastify"
// import {PanierController} from '../controller/panier'
import {IUtiliserPanier} from '../../metier/usecases/utiliserpanier'
import {PanierPresenter, Panier} from '../../metier/panier'
// import {PanierPresenter} from '../../metier/panier'

type CreatePanierRequestBody = {
  reference: string
  quantity: number
}

class Presenter implements PanierPresenter{
  envoyerLigne(ligne: string): void {
    throw new Error("xxx")
  }
  envoyerPanier(panier: Panier): void {
    throw new Error("xxx")
  }
}

export default class RoutePanier {
  constructor(private fastify: FastifyInstance, private useCase: IUtiliserPanier)
  {}

  run() {
  this.fastify.get("/panier/:panierid", async (request: FastifyRequest, reply: FastifyReply) => {

    // this.useCase.visualiserPanier(panierId)

    reply.status(200).send({ hello: "panier" })
  })

  this.fastify.post<{ Body: CreatePanierRequestBody }>(
    "/panier",
    async (request, reply) => {
      request.log.info({ body: request.body })
      reply.status(200).send({ panier: "piano" })
    },
  )
  }
}

// export default async function routesPanier(
//   fastify: FastifyInstance,
//   options: any,
// ) {
//   const controller = new PanierContoller(fastify.useCasePlugin)
//   fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
//     reply.status(200).send({ hello: "panier" })
//   })
// 
//   fastify.post<{ Body: CreatePanierRequestBody }>(
//     "/panier",
//     async (request, reply) => {
//       request.log.info({ body: request.body })
//       reply.status(200).send({ panier: "piano" })
//     },
//   )
// }
