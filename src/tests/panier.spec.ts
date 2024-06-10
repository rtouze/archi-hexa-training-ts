import {describe, expect, test} from '@jest/globals'
import {Panier} from '../metier/panier'

describe("Le panier", () => {
  test("doit permttre d'ajouter une reference", () => {
    const p = new Panier("foobar", [])
    p.ajouterReference("ref1")
    expect(p.getReferences()).toHaveLength(1)
    expect(p.getReferences()[0]).toEqual("ref1")
  })
})

