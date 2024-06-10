import {
  PanierDTO,
  PanierDTODB,
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
    return new Promise((resolve) => {
      this.paniers[panier.id] = JSON.stringify(panier.toDTODb())
      resolve()
    })
  }

  recuperer(panierId: string): Promise<Panier> {
    return new Promise((resolve) => {
      const dto: PanierDTODB = JSON.parse(this.paniers[panierId])
      const panier = new Panier(dto.id, dto.references, dto.items)

      resolve(panier)
    })
  }
}
