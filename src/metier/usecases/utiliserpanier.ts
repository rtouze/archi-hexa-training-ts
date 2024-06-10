import { v4 as uuidv4 } from "uuid"
import {PanierRepository, Panier, PanierDTO} from "../panier"


export interface PanierPresenter {
  envoyerLigne(ligne: string): void
}

export class UtiliserPanier {
  panierRepository: PanierRepository

  constructor(panierRepository: PanierRepository) {
    this.panierRepository = panierRepository
  }

  async initialiserPanier(): Promise<string> {
    const panier = new Panier(uuidv4(), [])
    await this.panierRepository.sauver(panier)
    return panier.id
  }

  async ajouterReference(panierId: string, reference: string): Promise<PanierDTO> {
    const panier = await this.panierRepository.recuperer(panierId)
    panier.ajouterReference(reference)
    await this.panierRepository.sauver(panier)
    return panier.toDTO()
  }

  async retirerReference(panierId: string, reference: string): Promise<PanierDTO> {
    const panier = await this.panierRepository.recuperer(panierId)
    panier.retirerReference(reference)
    await this.panierRepository.sauver(panier)
    return panier.toDTO()
  }

  async visualiserPanier(panierId: string): Promise<PanierDTO> {
    const panier = await this.panierRepository.recuperer(panierId)
    return panier.toDTO()
  }

  async visualiserPanier2(panierId: string, presenter:PanierPresenter): Promise<void> {
    const panier = await this.panierRepository.recuperer(panierId)
    const ref = panier.getReferences()
    presenter.envoyerLigne(`Panier ${panier.id}`)
    ref.forEach(r => {
      presenter.envoyerLigne(`   ${r}`)
    })
  }
}

