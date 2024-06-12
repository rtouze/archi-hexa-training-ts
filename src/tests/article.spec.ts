import { describe, test, expect } from "vitest"
import { Article, Produit, ProduitBuilder, Quantite } from "../metier/values"

function getProduit(suffix: string = "ref"): Produit {
  return new ProduitBuilder()
    .avecSku(`sku-${suffix}`)
    .avecGtin(`gtin-${suffix}`)
    .creer()
}

describe("Article", () => {

  test("doit ajouter une quantite", () => {
    const article = new Article(getProduit(), new Quantite(1))
    const newArticle = article.ajouterQuantite(new Quantite(2))
    expect(newArticle.quantite).toEqual(new Quantite(3))
  })

  test("doit se decrementer", () => {
    const article = new Article(getProduit(), new Quantite(2))
    const newArticle = article.decrementerQuantite()
    expect(newArticle.quantite).toEqual(new Quantite(1))
  })

  test("peut generer un DTO", () => {
    const article = new Article(getProduit(), new Quantite(2))
    expect(article.toDto()).toEqual({
      quantite: 2,
      produit: {
        sku: 'sku-ref',
        gtin: 'gtin-ref'
      }
    })
  })

})
