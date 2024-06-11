import { describe, expect, test, beforeEach } from "vitest"

import {
  UtiliserPanier,
  PanierPresenter,
} from "../metier/usecases/utiliserpanier"
import { PanierRepository, Panier } from "../metier/panier"

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
      const panier = new Panier(dto.id, dto.references, dto.items)

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

describe("UtiliserPanier", () => {
  let testDouble: PanierRepositoryDouble
  let panierId: string
  let usecase: UtiliserPanier

  beforeEach(async () => {
    testDouble = new PanierRepositoryDouble()
    usecase = new UtiliserPanier(testDouble)
    panierId = await usecase.initialiserPanier()
  })

  // test("doit initialiser un panier et renvoyer son ID", async () => {
  //   expect(panierId).toBeDefined()
  //   expect(await usecase.visualiserPanier(panierId)).toEqual({
  //     id: panierId,
  //     references: [],
  //   })
  // })

  test("doit sauvegarder le panier initialisé en base", async () => {

    expect(testDouble.panierAEteSauve(panierId)).toBe(true)
  })

  // test("doit ajouter une ref", async () => {
  //   await usecase.ajouterReference(panierId, "reference")
  //   const p = await usecase.visualiserPanier(panierId)
  //   expect(p).toEqual({
  //     id: panierId,
  //     references: ["reference"],
  //   })
  // })

  // test("doit retirer une ref", async () => {
  //   await usecase.ajouterReference(panierId, "reference")
  //   await usecase.retirerReference(panierId, "reference")
  //   const p = await usecase.visualiserPanier(panierId)
  //   expect(p).toEqual({
  //     id: panierId,
  //     references: [],
  //   })
  // })

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
