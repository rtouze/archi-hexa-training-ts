import { PanierRepository, Panier } from "../metier/panier"
import { Article, Quantite, ProduitBuilder } from "../metier/values"
import { Client as PgClient } from "pg"

type Collection<T> = {
  [id: string]: T
}

export class PanierRepositoryEnMemoire implements PanierRepository {
  private paniers: Collection<string>
  constructor() {
    this.paniers = {}
  }

  sauver(panier: Panier): Promise<void> {
    throw new Error("not implemented")
    // return new Promise((resolve) => {
    //   this.paniers[panier.id] = JSON.stringify(panier.toDTODb())
    //   resolve()
    // })
  }

  recuperer(panierId: string): Promise<Panier> {
    throw new Error("not implemented")
    // return new Promise((resolve) => {
    //   const dto: PanierDTODB = JSON.parse(this.paniers[panierId])
    //   const items = dto.items.map(
    //     (i: ItemDTO) => new Item(i.reference, new Quantite(i.quantite)),
    //   )
    //   const panier = new Panier(dto.id, dto.references, items)

    //   resolve(panier)
    // })
  }
}

type ArticleData = {
  quantity: number
  sku: string
  gtin: string
}

export class PanierRepositoryDb implements PanierRepository {
  constructor(private readonly client: PgClient) {}
  async sauver(panier: Panier): Promise<void> {
    const dto = panier.toDto()

    await this.client.query(
      "INSERT INTO panier (uuid) VALUES ($1) ON CONFLICT (uuid) DO NOTHING",
      [dto.id],
    )

    await this.client.query("DELETE FROM article WHERE panier_id = $1", [
      dto.id,
    ])

    dto.articles.forEach(async (a) => {
      await this.client.query(
        "INSERT INTO article (panier_id, quantity, sku) VALUES ($1, $2, $3)",
        [dto.id, a.quantite, a.produit.sku],
      )
    })
  }

  async recuperer(panierId: string): Promise<Panier> {
    const data = await this.client.query(
      "SELECT 1 FROM panier WHERE uuid = $1",
      [panierId],
    )
    if (data.rows.length === 0) {
      throw new Error(`Panier ${panierId} non trouvé`)
    }
    const articleData = await this.client.query<ArticleData>(
      `
    select a.quantity, c.sku, c.gtin
    from article a join catalogue c on c.sku = a.sku
    where a.panier_id = $1`,
      [panierId],
    )

    const articles = articleData.rows.map((ad) => {
      return new Article(
        new ProduitBuilder().avecSku(ad.sku).avecGtin(ad.gtin).creer(),
        new Quantite(ad.quantity),
      )
    })

    return new Panier(panierId, articles)
  }
}
