import { describe, expect, test, beforeEach } from "vitest"

import { UtiliserPanier } from "../metier/usecases/utiliserpanier"
import { PanierRepository, Panier, PanierPresenter } from "../metier/panier"
import { Quantite, Produit, ProduitBuilder, AdresseRepository, Adresse} from "../metier/values"
import { Catalogue } from "../metier/catalogue"

type Collection<T> = {
  [id: string]: T
}

class PanierRepositoryDouble implements PanierRepository {
  private paniersSauves: Array<string> = []
  public paniers: Collection<Panier> = {}

  async sauver(panier: Panier): Promise<void> {
    this.paniersSauves.push(panier.id)
    this.paniers[panier.id] = panier
    return
  }

  async recuperer(panierId: string): Promise<Panier> {
    return this.paniers[panierId]
  }

  panierAEteSauve(): number {
    return this.paniersSauves.length
  }
}

class PanierPresenterTestDouble implements PanierPresenter {
  public lignes: Array<string> = []
  envoyerLigne(ligne: string): void {
    this.lignes.push(ligne)
  }

  envoyerPanier(panier: Panier) {
    throw new Error("Not implemented")
  }
}

class CatalogueDouble implements Catalogue {
  recupererProduit(sku: string): Promise<Produit> {
    return new Promise((resolve) => {
      return resolve(new ProduitBuilder().avecSku(sku).avecGtin("gtin").creer())
    })
  }

  afficher(): Promise<Array<string>> {
    throw new Error("Not implemented")
  }
}


class AdresseRepositoryTestDouble implements AdresseRepository {
  async recupererAresse(adresseId: string): Promise<Adresse> {
    return new Adresse(
      "google_place",
      "23 rue favre",
      "69006",
      "Lyon",
      "France"
    )
  }
}

describe("UtiliserPanier", () => {
  let panierRepositoryDouble: PanierRepositoryDouble
  let catalogueDouble: CatalogueDouble
  let panierId: string
  let usecase: UtiliserPanier
  const adresseRepositoryTestDouble = new AdresseRepositoryTestDouble()

  beforeEach(async () => {
    panierRepositoryDouble = new PanierRepositoryDouble()
    catalogueDouble = new CatalogueDouble()
    usecase = new UtiliserPanier(panierRepositoryDouble, catalogueDouble, adresseRepositoryTestDouble)
    panierId = await usecase.initialiserPanier()
  })

  test("doit sauvegarder le panier initialisé en base", async () => {
    expect(panierRepositoryDouble.panierAEteSauve()).toEqual(1)
  })

  test("doit permettre de visualiser le panier dans le presenter", async () => {
    await usecase.ajouterReference(panierId, "reference")
    const panierPresenter = new PanierPresenterTestDouble()
    await usecase.visualiserPanier(panierId, panierPresenter)

    expect(panierPresenter.lignes).toEqual([
      "reference - 1",
    ])
  })

  test("doit ajouter une quantité de ref", async () => {
    await usecase.ajouterReference(panierId, "reference", 5)
    const paniers = panierRepositoryDouble.paniers
    expect(paniers[panierId].articles).toHaveLength(1)
    expect(paniers[panierId].articles[0].quantite.valeur).toEqual(5)
    expect(paniers[panierId].articles[0].produit.sku).toEqual("reference")
  })

  test("doit décrementer une quantité de ref", async () => {
    await usecase.ajouterReference(panierId, "reference", 5)
    await usecase.decrementerReference(panierId, "reference")
    const paniers = panierRepositoryDouble.paniers
    expect(paniers[panierId].articles[0].quantite.valeur).toEqual(4)
    expect(paniers[panierId].articles[0].produit.sku).toEqual("reference")
  })

  test("doit incrémenter une quantité de ref", async () => {
    await usecase.ajouterReference(panierId, "reference", 5)
    await usecase.incrementerReference(panierId, "reference")
    const paniers = panierRepositoryDouble.paniers
    expect(paniers[panierId].articles[0].quantite).toEqual(new Quantite(6))
  })
  
  test("doit retirer une ref", async () => {
    await usecase.ajouterReference(panierId, "reference", 5)
    await usecase.retirerReference(panierId, "reference")
    const paniers = panierRepositoryDouble.paniers
    expect(paniers[panierId].articles).toHaveLength(0)
  })

  test("doit retirer une ref", async () => {
    await usecase.ajouterReference(panierId, "reference", 5)
    await usecase.retirerReference(panierId, "reference")
    const paniers = panierRepositoryDouble.paniers
    expect(paniers[panierId].articles).toHaveLength(0)
  })

  test("doit ajouter une adresse sur un panier", async() => {
  })
})

// vim: fdm=indent
