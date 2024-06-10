import { describe, expect, test } from "@jest/globals"
import { UtiliserPanier } from "../metier/usecases/utiliserpanier"
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
      this.paniers[panier.id] = JSON.stringify(panier.toDTO())
      resolve()
    })
  }

  recuperer(panierId: string): Promise<Panier> {
    return new Promise((resolve) => {
      const dto = JSON.parse(this.paniers[panierId])
      const panier = new Panier(dto.id, dto.references)

      resolve(panier)
    })
  }

  panierAEteSauve(panierId: string): boolean {
    return this.paniersSauves.findIndex((pid) => pid === panierId) >= 0
  }
}

describe("UtiliserPanier", () => {
  test("doit initialiser un panier", async () => {
    const testDouble = new PanierRepositoryDouble()
    const usecase = new UtiliserPanier(testDouble)
    const panierId = await usecase.initialiserPanier()
    expect(panierId).toBeDefined()
    expect(await usecase.visualiserPanier(panierId)).toEqual({
      id: panierId,
      references: [],
    })
  })

  test("doit sauvegarder le panier initialise en base", async () => {
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
})
