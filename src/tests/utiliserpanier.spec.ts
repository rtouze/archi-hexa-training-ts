import { describe, expect, test, beforeEach } from "vitest"

import {
  UtiliserPanier,
  PanierPresenter,
} from "../metier/usecases/utiliserpanier"
import { PanierRepository, Panier, Item, ItemDTO } from "../metier/panier"
import { Quantite, Produit, ProduitBuilder } from "../metier/values"
import { Catalogue } from "../metier/catalogue"

type Collection<T> = {
  [id: string]: T
}

class PanierRepositoryDouble implements PanierRepository {
  private paniersSauves: Array<string> = []
  private paniers: Collection<string> = {}

  sauver(panier: Panier): Promise<void> {
    this.paniersSauves.push(panier.id)

    return new Promise((resolve) => {
      this.paniers[panier.id] = JSON.stringify(panier.toDTODb())
      resolve()
    })
  }

  recuperer(panierId: string): Promise<Panier> {
    return new Promise((resolve) => {
      const dto = JSON.parse(this.paniers[panierId])
      const items = dto.items.map(
        (i: ItemDTO) => new Item(i.reference, new Quantite(i.quantite)),
      )
      const panier = new Panier(dto.id, dto.references, items)

      resolve(panier)
    })
  }

  panierAEteSauve(panierId: string): boolean {
    return this.paniersSauves.findIndex((pid) => pid === panierId) >= 0
  }
}

class PanierPresenterTestDouble implements PanierPresenter {
  public lignes: Array<string> = []
  envoyerLigne(ligne: string): void {
    this.lignes.push(ligne)
  }
}

class CatalogueDouble implements Catalogue {
  recupererProduit(sku: string): Promise<Produit> {
    return new Promise(resolve => {
      return resolve(new ProduitBuilder().avecSku(sku).avecGtin("gtin").creer())
    })
  }

  afficher(): Promise<Array<string>> {
    throw new Error("Not implemented")
  }
}

describe("UtiliserPanier", () => {
  let panierRepositoryDouble: PanierRepositoryDouble
  let catalogueDouble: CatalogueDouble
  let panierId: string
  let usecase: UtiliserPanier

  beforeEach(async () => {
    panierRepositoryDouble = new PanierRepositoryDouble()
    catalogueDouble = new CatalogueDouble()
    usecase = new UtiliserPanier(panierRepositoryDouble, catalogueDouble)
    panierId = await usecase.initialiserPanier()
  })

  test("doit sauvegarder le panier initialisé en base", async () => {
    expect(panierRepositoryDouble.panierAEteSauve(panierId)).toBe(true)
  })

  test("doit permettre de visualiser le panier dans le presenter", async () => {
    await usecase.ajouterReference(panierId, "reference")
    const panierPresenter = new PanierPresenterTestDouble()
    await usecase.visualiserPanier(panierId, panierPresenter)

    expect(panierPresenter.lignes).toEqual([
      `Panier ${panierId}`,
      "   reference - 1",
    ])
  })

  test("doit ajouter une quantité de ref", async () => {
    await usecase.ajouterReference(panierId, "reference", 5)
    await usecase.ajouterReference(panierId, "reference2", 6)
    const panierPresenter = new PanierPresenterTestDouble()
    await usecase.visualiserPanier(panierId, panierPresenter)
    expect(panierPresenter.lignes).toEqual([
      `Panier ${panierId}`,
      "   reference - 5",
      "   reference2 - 6",
    ])
  })

  test("doit décrementer une quantité de ref", async () => {
    await usecase.ajouterReference(panierId, "reference", 5)
    await usecase.decrementerReference(panierId, "reference")
    const panierPresenter = new PanierPresenterTestDouble()
    await usecase.visualiserPanier(panierId, panierPresenter)
    expect(panierPresenter.lignes).toEqual([
      `Panier ${panierId}`,
      "   reference - 4",
    ])
  })

  test("doit incrémenter une quantité de ref", async () => {
    await usecase.ajouterReference(panierId, "reference", 5)
    await usecase.incrementerReference(panierId, "reference")
    const panierPresenter = new PanierPresenterTestDouble()
    await usecase.visualiserPanier(panierId, panierPresenter)
    expect(panierPresenter.lignes).toEqual([
      `Panier ${panierId}`,
      "   reference - 6",
    ])
  })
})

// vim: fdm=indent
