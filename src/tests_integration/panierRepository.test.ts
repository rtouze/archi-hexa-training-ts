import { describe, test, expect, beforeAll, beforeEach, afterEach } from 'vitest'
import { Client } from 'pg'
import {PanierRepositoryDb} from '../infra/panier'
import { v4 as uuidv4 } from 'uuid'
import { Panier } from '../metier/panier'


describe("PanierRepositoryDb", () => {
  let client:Client
  beforeAll(async () => {
    client = new Client({
      connectionString: "postgres://enslipch:secret@localhost:8888/enslipch",
    })
    await client.connect()
  })
  beforeEach(async () => {
    await client.query('begin')
  })
  afterEach(async () => {
    await client.query('rollback')
  })
  test("peut sauver un panier vide", async () => {
    const repo = new PanierRepositoryDb(client)
    const panierId = uuidv4()
    await repo.sauver(new Panier(panierId, []))
    const nouveauPanier = await repo.recuperer(panierId)
    const resp = await client.query<{uuid: string}>("select uuid from panier")
    expect(nouveauPanier.toDto().id).toEqual(panierId)

  })
})
