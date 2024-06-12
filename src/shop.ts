import {
  UtiliserPanier
} from "./metier/usecases/utiliserpanier"
import { PanierPresenter, Panier } from "./metier/panier"
import { Catalogue } from "./metier/catalogue"
import { PanierRepositoryEnMemoire } from "./infra/panier"
import { Produit, AdresseRepository, Adresse} from "./metier/values"

class ConsolePresenter implements PanierPresenter {
  private lignes: Array<string>
  constructor() {
    this.lignes = []
  }

  envoyerLigne(ligne: string): void {
    this.lignes.push(ligne)
  }

  afficherLignes(): void {
    this.lignes.forEach((l) => console.log(l))
  }

  envoyerPanier(panier: Panier) {
    throw new Error("Not implemented")
  }
}

class CatalogueStub implements Catalogue {
  recupererProduit(sku: string): Promise<Produit> {
    throw new Error("Not implemented")
  }
  afficher(): Promise<Array<string>> {
    throw new Error("Not implemented")
  }
}

class AdresseRepositoryStub implements AdresseRepository {
  recupererAresse(adresseId: string): Promise<Adresse> {
    throw new Error("not impl")
  }
}


async function shop() {
  console.log("Test de notre shop")

  const panierRepository = new PanierRepositoryEnMemoire()
  const utiliserPanier = new UtiliserPanier(panierRepository, new CatalogueStub(), new AdresseRepositoryStub())

  const panierId = await utiliserPanier.initialiserPanier()

  await utiliserPanier.ajouterReference(panierId, "slip-noir")
  await utiliserPanier.ajouterReference(panierId, "slip-blanc")
  await utiliserPanier.retirerReference(panierId, "slip-noir")

  const presenter = new ConsolePresenter()
  // await utiliserPanier.visualiserPanier(panierId, presenter)
  presenter.afficherLignes()
}

shop()

// vim: fdm=indent :
