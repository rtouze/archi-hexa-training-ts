import { v4 as uuidv4 } from "uuid"

interface PanierRepository {
  sauver(panier: Panier): Promise<void>
  recuperer(panierId: string): Promise<Panier>
}

type Collection<T> = {
  [id: string]: T
}

class PanierRepositoryEnMemoire implements PanierRepository {
  private paniers: Collection<string>
  constructor() {
    this.paniers = {}
  }

  sauver(panier: Panier): Promise<void> {
    return new Promise((resolve) => {
      this.paniers[panier.id] = JSON.stringify(panier)
      resolve()
    })
  }

  recuperer(panierId: string): Promise<Panier> {
    return new Promise((resolve) => {
      resolve(JSON.parse(this.paniers[panierId]))
    })
  }
}

class UtiliserPanier {
  panierRepository: PanierRepository

  constructor(panierRepository: PanierRepository) {
    this.panierRepository = panierRepository
  }

  async initialiserPanier(): Promise<string> {
    const panierId = uuidv4()
    await this.panierRepository.sauver({id: panierId, references: []})
    return panierId
  }

  async ajouterReference(panierId: string, reference: string): Promise<Panier> {
    const panier = await this.panierRepository.recuperer(panierId)
    panier.references.push(reference)
    await this.panierRepository.sauver(panier)
    return panier
  }

  async retirerReference(panierId: string, reference: string): Promise<Panier> {
    const panier = await this.panierRepository.recuperer(panierId)
    const index = panier.references.findIndex(r => r === reference)
    panier.references.splice(index, 1)
    await this.panierRepository.sauver(panier)
    return panier
  }

  async visualiserPanier(panierId: string): Promise<Panier> {
    return await this.panierRepository.recuperer(panierId)
  }
}

type Panier = {
  id: string
  references: Array<string>
}

async function shop() {
  console.log("Test de notre shop")

  const panierRepository = new PanierRepositoryEnMemoire()
  const utiliserPanier = new UtiliserPanier(panierRepository)

  const panierId = await utiliserPanier.initialiserPanier()

  await utiliserPanier.ajouterReference(panierId, "slip-noir")
  await utiliserPanier.ajouterReference(panierId, "slip-blanc")
  await utiliserPanier.retirerReference(panierId, "slip-noir")

  const panier = await utiliserPanier.visualiserPanier(panierId)
  console.log("Panier", panier)

}

shop()
