import {Catalogue} from "../metier/catalogue"
import {ProduitBuilder, Produit} from "../metier/values"
import {PoolClient as PgClient} from "pg"

export class CatalogueDB implements Catalogue {

  constructor(private readonly pgClient:PgClient ) {
  }

  async recupererProduit(sku: string): Promise<Produit> {
    const data = await this.pgClient.query("SELECT sku, gtin FROM catalogue WHERE sku = $1", [sku])
    if (data.rows.length) {
      return new ProduitBuilder().avecSku(data.rows[0].sku).avecGtin(data.rows[0].gtin).creer()
    }
    throw new Error("Produit non trouvé")
  }

  async afficher(): Promise<Array<string>> {
    const data = await this.pgClient.query("SELECT sku, gtin FROM catalogue")
    return data.rows.map((r:any) => `${r.sku} - ${r.gtin}`)
  }
}
