import {describe, test, expect} from 'vitest'
import {ProduitBuilder, Produit} from '../metier/values'

describe("ProduitBuilder", () => {
  test("peut contruire un produit", () => {
    const pb = new ProduitBuilder()
    const produit = pb.avecSku("sku").avecGtin("gtin").creer()
    expect(produit).toEqual(new Produit("sku", "gtin", "", 0))
  })
})
