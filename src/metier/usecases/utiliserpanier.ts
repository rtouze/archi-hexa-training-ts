import { v4 as uuidv4 } from "uuid"
import { PanierRepository, Panier, PanierDTO } from "../panier"

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

  async ajouterReference(
    panierId: string,
    reference: string,
    quantite: number = 1,
  ): Promise<PanierDTO> {
    const panier = await this.panierRepository.recuperer(panierId)
    panier.ajouterItems(reference, quantite)
    panier.ajouterReference(reference)
    await this.panierRepository.sauver(panier)
    return panier.toDTO()
  }

  async retirerReference(
    panierId: string,
    reference: string,
  ): Promise<PanierDTO> {
    const panier = await this.panierRepository.recuperer(panierId)
    panier.retirerReference(reference)
    panier.retirerItem(reference)
    await this.panierRepository.sauver(panier)
    return panier.toDTO()
  }

  async decrementerReference(
    panierId: string,
    reference: string,
  ): Promise<PanierDTO> {
    const panier = await this.panierRepository.recuperer(panierId)
    panier.decrementerItem(reference)
    await this.panierRepository.sauver(panier)
    return panier.toDTO()
  }

  async incrementerReference(
    panierId: string,
    reference: string,
  ): Promise<PanierDTO> {
    const panier = await this.panierRepository.recuperer(panierId)
    panier.incrementerItem(reference)
    await this.panierRepository.sauver(panier)
    return panier.toDTO()
  }

  async visualiserPanier(panierId: string): Promise<PanierDTO> {
    const panier = await this.panierRepository.recuperer(panierId)
    return panier.toDTO()
  }

  async visualiserPanier2(
    panierId: string,
    presenter: PanierPresenter,
  ): Promise<void> {
    const panier = await this.panierRepository.recuperer(panierId)
    const ref = panier.getReferences()
    presenter.envoyerLigne(`Panier ${panier.id}`)
    ref.forEach((r) => {
      presenter.envoyerLigne(`   ${r} - 1`)
    })
  }

  async visualiserPanier3(
    panierId: string,
    presenter: PanierPresenter,
  ): Promise<void> {
    const panier = await this.panierRepository.recuperer(panierId)
    const items = panier.getItems()
    presenter.envoyerLigne(`Panier ${panier.id}`)
    items.forEach((i) => {
      presenter.envoyerLigne(`   ${i.reference} - ${i.quantite}`)
    })
  }
}
