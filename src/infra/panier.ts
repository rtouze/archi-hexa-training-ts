import {
  PanierRepository,
  Panier,
} from "../metier/panier"

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
