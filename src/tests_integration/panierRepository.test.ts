import { describe, test, expect, beforeAll, beforeEach, afterEach } from 'vitest'
import { Client } from 'pg'
import {PanierRepositoryDb} from '../infra/panier'
import { v4 as uuidv4 } from 'uuid'
import { Panier } from '../metier/panier'
import { ProduitBuilder, Quantite } from '../metier/values'


describe("PanierRepositoryDb", () => {
  let client:Client
  let repo:PanierRepositoryDb

  beforeAll(async () => {
    client = new Client({
      connectionString: "postgres://enslipch:secret@localhost:8888/enslipch",
    })
    await client.connect()
  })
  beforeEach(async () => {
    await client.query('begin')
    repo = new PanierRepositoryDb(client)
  })
  afterEach(async () => {
    await client.query('rollback')
  })
  test("peut sauver un panier vide", async () => {
    const panierId = uuidv4()
    await repo.sauver(new Panier(panierId, []))
    const nouveauPanier = await repo.recuperer(panierId)
    expect(nouveauPanier.toDto().id).toEqual(panierId)
  })

  test("renvoie une exception si le panier n'est pas trouvé", async () => {
    const panierId = uuidv4()
    try {
      await repo.recuperer(panierId)
    } catch (e) {
      expect(e).toEqual(new Error(`Panier ${panierId} non trouvé`))
    }
  })

  test("peut sauver un panier avec articles", async () => {
    const panierId = uuidv4()
    const panier = new Panier(panierId, [])
    const p = new ProduitBuilder().avecSku('slip-noir').avecGtin('12345').creer()
    const p2 = new ProduitBuilder().avecSku('slip-blanc').avecGtin('12346').creer()
    panier.ajouterArticle(p, new Quantite(3))
    panier.ajouterArticle(p2, new Quantite(6))
    await repo.sauver(panier)
    const nouveauPanier = await repo.recuperer(panierId)
    const dto = nouveauPanier.toDto()
    expect(dto.articles).toHaveLength(2)
    expect(dto.articles[0].quantite).toEqual(3)
    expect(dto.articles[1].quantite).toEqual(6)
    expect(dto.articles[0].produit).toEqual({sku:'slip-noir', gtin: '12345'})
    expect(dto.articles[1].produit).toEqual({sku:'slip-blanc', gtin:  '12346'})
  })
})
