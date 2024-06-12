import { v4 as uuidv4 } from "uuid"
import { PanierRepository, Panier, PanierPresenter } from "../panier"
import { Quantite, AdresseRepository } from "../values"
import { Catalogue } from "../catalogue"

export interface IUtiliserPanier {
  initialiserPanier(): Promise<string> 

  ajouterReference(
    panierId: string,
    sku: string,
    quantite: number,
  ): Promise<void> 

  retirerReference(panierId: string, sku: string): Promise<void> 

  decrementerReference(panierId: string, sku: string): Promise<void> 

  incrementerReference(panierId: string, sku: string): Promise<void> 

  visualiserPanier(
    panierId: string,
    presenter: PanierPresenter,
  ): Promise<void> 

}


export class UtiliserPanier {

  constructor(private readonly panierRepository: PanierRepository, private readonly catalogue: Catalogue, private readonly adresseRepository:AdresseRepository) {
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
