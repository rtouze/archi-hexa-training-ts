import { describe, expect, test } from "@jest/globals"
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
  test("doit initialiser un panier et renvoyer son ID", async () => {
    const testDouble = new PanierRepositoryDouble()
    const usecase = new UtiliserPanier(testDouble)
    const panierId = await usecase.initialiserPanier()

    expect(panierId).toBeDefined()
    expect(await usecase.visualiserPanier(panierId)).toEqual({
      id: panierId,
      references: [],
    })
  })

  test("doit sauvegarder le panier initialisé en base", async () => {
    const testDouble = new PanierRepositoryDouble()
    const usecase = new UtiliserPanier(testDouble)
    const panierId = await usecase.initialiserPanier()

    expect(testDouble.panierAEteSauve(panierId)).toBe(true)
  })

  test("doit ajouter une ref", async () => {
    const testDouble = new PanierRepositoryDouble()
    const usecase = new UtiliserPanier(testDouble)
    const panierId = await usecase.initialiserPanier()
    await usecase.ajouterReference(panierId, "reference")

    const p = await usecase.visualiserPanier(panierId)
    expect(p).toEqual({
      id: panierId,
      references: ["reference"],
    })
  })

  test("doit retirer une ref", async () => {
    const testDouble = new PanierRepositoryDouble()
    const usecase = new UtiliserPanier(testDouble)
    const panierId = await usecase.initialiserPanier()
    await usecase.ajouterReference(panierId, "reference")
    await usecase.retirerReference(panierId, "reference")
    const p = await usecase.visualiserPanier(panierId)
    expect(p).toEqual({
      id: panierId,
      references: [],
    })
  })

  test("doit permettre de visualiser le panier dans le presenter", async () => {
    const testDouble = new PanierRepositoryDouble()
    const usecase = new UtiliserPanier(testDouble)
    const panierId = await usecase.initialiserPanier()
    await usecase.ajouterReference(panierId, "reference")
    const panierPresenter = new PanierPresenterTestDouble()
    await usecase.visualiserPanier2(panierId, panierPresenter)

    expect(panierPresenter.lignes).toEqual([
      `Panier ${panierId}`,
      "   reference - 1",
    ])
  })

  test("doit ajouter une quantité de ref", async () => {
    const testDouble = new PanierRepositoryDouble()
    const usecase = new UtiliserPanier(testDouble)
    const panierId = await usecase.initialiserPanier()
    await usecase.ajouterReference(panierId, "reference", 5)
    await usecase.ajouterReference(panierId, "reference2", 6)
    const panierPresenter = new PanierPresenterTestDouble()
    await usecase.visualiserPanier3(panierId, panierPresenter)
    expect(panierPresenter.lignes).toEqual([
      `Panier ${panierId}`,
      "   reference - 5",
      "   reference2 - 6",
    ])
  })

  test("doit décrementer une quantité de ref", async () => {
    const testDouble = new PanierRepositoryDouble()
    const usecase = new UtiliserPanier(testDouble)
    const panierId = await usecase.initialiserPanier()
    await usecase.ajouterReference(panierId, "reference", 5)
    await usecase.decrementerReference(panierId, "reference")
    const panierPresenter = new PanierPresenterTestDouble()
    await usecase.visualiserPanier3(panierId, panierPresenter)
    expect(panierPresenter.lignes).toEqual([
      `Panier ${panierId}`,
      "   reference - 4",
    ])
  })

  test("doit incrémenter une quantité de ref", async () => {
    const testDouble = new PanierRepositoryDouble()
    const usecase = new UtiliserPanier(testDouble)
    const panierId = await usecase.initialiserPanier()
    await usecase.ajouterReference(panierId, "reference", 5)
    await usecase.incrementerReference(panierId, "reference")
    const panierPresenter = new PanierPresenterTestDouble()
    await usecase.visualiserPanier3(panierId, panierPresenter)
    expect(panierPresenter.lignes).toEqual([
      `Panier ${panierId}`,
      "   reference - 6",
    ])
  })
})

// vim: fdm=indent
