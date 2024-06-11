import { Catalogue } from "../metier/catalogue"
import { ProduitBuilder, Produit } from "../metier/values"
import { PoolClient as PgClient } from "pg"

type ProduitRow = {
  sku: string
  gtin: string
}

export class CatalogueDB implements Catalogue {
  constructor(private readonly pgClient: PgClient) {}

  async recupererProduit(sku: string): Promise<Produit> {
    const data = await this.pgClient.query<ProduitRow>(
      "SELECT sku, gtin FROM catalogue WHERE sku = $1",
      [sku],
    )
    if (data.rows.length) {
      return new ProduitBuilder()
        .avecSku(data.rows[0].sku)
        .avecGtin(data.rows[0].gtin)
        .creer()
    }
    throw new Error("Produit non trouvé")
  }

  async afficher(): Promise<Array<string>> {
    const data = await this.pgClient.query<ProduitRow>(
      "SELECT sku, gtin FROM catalogue",
    )
    return data.rows.map((r: ProduitRow) => `${r.sku} - ${r.gtin}`)
  }
}
