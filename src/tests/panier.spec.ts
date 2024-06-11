import { describe, expect, test } from "vitest"
import { Panier } from "../metier/panier"

describe("Le panier", () => {

  test("doit être initialisé avec une liste de références", () => {
    const p = new Panier("foobar", ["ref1", "ref2"])
    expect(p.toDTO()).toEqual({
      id: "foobar",
      references: ["ref1", "ref2"],
    })
  })

  test("doit permettre d'ajouter un item de quantite 1", () => {
    const p = new Panier("foobar", [])
    p.ajouterItems("ref1", 1)
    expect(p.getItems()).toEqual([
      {
        reference: "ref1",
        quantite: 1,
      },
    ])
  })

  test("doit permettre d'ajouter un item de quantite 5", () => {
    const p = new Panier("foobar", [])
    p.ajouterItems("ref1", 5)
    expect(p.getItems()).toEqual([
      {
        reference: "ref1",
        quantite: 5,
      },
    ])
  })

  test("doit permettre d'incrémenter une quantite d'item", () => {
    const p = new Panier("foobar", [])
    p.ajouterItems("ref1", 5)
    p.incrementerItem("ref1")
    expect(p.getItems()).toEqual([
      {
        reference: "ref1",
        quantite: 6,
      },
    ])
  })

  test("doit permettre de décrémenter une quantité d'item", () => {
    const p = new Panier("foobar", [])
    p.ajouterItems("ref1", 5)
    p.decrementerItem("ref1")
    expect(p.getItems()).toEqual([
      {
        reference: "ref1",
        quantite: 4,
      },
    ])
  })

  test("doit permettre d'ajouter des items en gardant une ligne par reference", () => {

    const p = new Panier("foobar", [])
    p.ajouterItems("ref1", 5)
    p.ajouterItems("ref1", 4)
    expect(p.getItems()).toEqual([
      {
        reference: "ref1",
        quantite: 9,
      },
    ])
  })

  test("doit retirer l'item de la liste si sa quantite est nulle", () => {
    const p = new Panier("foobar", [])
    p.ajouterItems("ref1", 5)
    for (let i = 0; i <5; i++) {
      p.decrementerItem("ref1")
    }

    expect(p.getItems()).toEqual([])
  })

  test("doit retirer un item", () => {
    const p = new Panier("foobar", [])
    p.ajouterItems("ref1", 5)
    p.retirerItem("ref1")
    expect(p.getItems()).toEqual([])
  })
})

// vim: fdm=indent
