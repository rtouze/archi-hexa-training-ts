import { v4 as uuidv4 } from "uuid"
import { PanierRepository, Panier, PanierPresenter } from "../panier"
import { Quantite } from "../values"
import { Catalogue } from "../catalogue"


export class UtiliserPanier {
  panierRepository: PanierRepository
  catalogue: Catalogue

  constructor(panierRepository: PanierRepository, catalogue: Catalogue) {
    this.panierRepository = panierRepository
    this.catalogue = catalogue
  }

  async initialiserPanier(): Promise<string> {
    const panier = new Panier(uuidv4(), [])
    await this.panierRepository.sauver(panier)
    return panier.id
  }

  async ajouterReference(
    panierId: string,
    sku: string,
    quantite: number = 1,
  ): Promise<void> {
    const panier = await this.panierRepository.recuperer(panierId)
    const produit = await this.catalogue.recupererProduit(sku)
    panier.ajouterArticle(produit, new Quantite(quantite))
    await this.panierRepository.sauver(panier)
  }

  async retirerReference(panierId: string, sku: string): Promise<void> {
    const panier = await this.panierRepository.recuperer(panierId)
    const produit = await this.catalogue.recupererProduit(sku)
    panier.retirerArticle(produit)
    await this.panierRepository.sauver(panier)
  }

  async decrementerReference(panierId: string, sku: string): Promise<void> {
    const panier = await this.panierRepository.recuperer(panierId)
    const produit = await this.catalogue.recupererProduit(sku)
    panier.decrementerArticle(produit)
    await this.panierRepository.sauver(panier)
  }

  async incrementerReference(panierId: string, sku: string): Promise<void> {
    const produit = await this.catalogue.recupererProduit(sku)
    const panier = await this.panierRepository.recuperer(panierId)
    panier.incrementerArticle(produit)
    await this.panierRepository.sauver(panier)
  }

  async visualiserPanier(
    panierId: string,
    presenter: PanierPresenter,
  ): Promise<void> {
    const panier = await this.panierRepository.recuperer(panierId)
    panier.visualiser(presenter)
  }
}
