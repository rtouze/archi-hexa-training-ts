import { describe, expect, test } from "vitest"
import { Quantite } from "../metier/values"

describe("Une Quantité", () => {
  test("peut etre initialisee", () => {
    const quantite = new Quantite(3)
    expect(quantite.valeur).toEqual(3)
  })

  test("doit être un entier positif", () => {
    expect(() => new Quantite(-3)).toThrow("Doit etre positif")
  })

  test("doit être un entier", () => {
    const quantite = new Quantite(3.3)
    expect(quantite).toEqual(new Quantite(3))
  })

  test("doit pouvoir s'ajouter", () => {
    expect(
      new Quantite(1).ajouter(new Quantite(2))
    ).toEqual(new Quantite(3))
  })

  test("doit pouvoir se soustraire", () => {
    expect(
      new Quantite(3).soustraire(new Quantite(2))
    ).toEqual(new Quantite(1))
  })

  test("doit pouvoir se soustraire 2", () => {
    expect(
      new Quantite(1).soustraire(new Quantite(2))
    ).toEqual(new Quantite(0))
  })

  test("doit pouvoir s'incrementer", () => {
    expect(
      new Quantite(1).incrementer()
    ).toEqual(new Quantite(2))
  })

  test("doit pouvoir s décrementer", () => {
    expect(
      new Quantite(2).decrementer()
    ).toEqual(new Quantite(1))
  })

})
