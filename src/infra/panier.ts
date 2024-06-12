import {
  PanierRepository,
  Panier,
} from "../metier/panier"
import { Client as PgClient } from 'pg'

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

export class PanierRepositoryDb implements PanierRepository {
  constructor(private readonly client: PgClient) {
    
  }
  async sauver(panier: Panier): Promise<void> {
    const dto = panier.toDto()
    await this.client.query("INSERT INTO panier (uuid) VALUES ($1) ON CONFLICT (uuid) DO NOTHING", [dto.id])
  }

  async recuperer(panierId: string): Promise<Panier> {
    const data = await this.client.query("SELECT 1 FROM panier WHERE uuid = $1", [panierId])
    if (data.rows.length === 0) {
      // TODO
      throw new Error("")
    }
    return new Panier(panierId, [])
  }
}
