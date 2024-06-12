import { describe, test, expect} from 'vitest'
import webapp from '../webapp'
import pg from "@fastify/postgres"

describe("webapp", () => {
  const server = webapp() 
  server.register(pg, {
    connectionString: "postgres://enslipch:secret@localhost:8888/enslipch",
})
  test("doit retourner le catalogue", async () => {
    const response = await server.inject({method: "GET", url: "/catalogue"})
    expect(response.json().data).toHaveLength(4)
  })
})
