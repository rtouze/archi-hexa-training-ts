import {describe, expect, test} from 'vitest'
import { ProduitBuilder} from "../metier/values"

describe("Produit", () => {
  test("peut tester son egalite", () => {
    const p1 = new ProduitBuilder().avecSku("sku").avecGtin("gtin").creer()
    const p2 = new ProduitBuilder().avecSku("sku").avecGtin("gtin").creer()
    expect(p1.egale(p2)).toBe(true)
  })

  test("peut generer un DTO", () => {
    const p1 = new ProduitBuilder().avecSku("sku").avecGtin("gtin").creer()
    expect(p1.toDto()).toEqual({sku: 'sku', gtin: 'gtin'})
  })
})
