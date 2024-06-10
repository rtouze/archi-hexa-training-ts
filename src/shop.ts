import {UtiliserPanier, PanierPresenter} from "./metier/usecases/utiliserpanier"
import {PanierRepositoryEnMemoire} from "./infra/panier"

class ConsolePresenter implements PanierPresenter {
  private lignes: Array<string>
  constructor() {
    this.lignes = []
  }

  envoyerLigne(ligne: string): void  {
    this.lignes.push(ligne)
  }

  afficherLignes(): void {
    this.lignes.forEach(l => console.log(l))
  }
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
  const presenter = new ConsolePresenter()
  await utiliserPanier.visualiserPanier2(panierId, presenter)
  presenter.afficherLignes()
}

shop()

// vim: fdm=indent :
