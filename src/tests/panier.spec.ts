import { describe, expect, test, beforeEach } from "vitest"
import { Panier, PanierPresenter } from "../metier/panier"
import { Quantite, ProduitBuilder, Produit, Article } from "../metier/values"

function getProduit(suffix: string = "ref"): Produit {
  return new ProduitBuilder()
    .avecSku(`sku-${suffix}`)
    .avecGtin(`gtin-${suffix}`)
    .creer()
}

class PanierPresenterDouble implements PanierPresenter{
  public lignes: Array<string> = []

  envoyerLigne(ligne: string) {
    this.lignes.push(ligne)
  }
}

describe("Le panier", () => {

  let panierPresenter: PanierPresenterDouble

  beforeEach(() => {
    panierPresenter = new PanierPresenterDouble()
  })
  test("doit être initialisé avec une liste d'articles", () => {
    const article1 = new Article(getProduit("ref1"), new Quantite(1))
    const article2 = new Article(getProduit("ref2"), new Quantite(2))
    const panier = new Panier("foobar", [article1, article2])
    panier.visualiser(panierPresenter)
    expect(panierPresenter.lignes).toHaveLength(2)
    expect(panierPresenter.lignes[0]).toEqual("sku-ref1 - 1")
    expect(panierPresenter.lignes[1]).toEqual("sku-ref2 - 2")
  })

  test("doit permettre d'incrémenter une quantite de produits", () => {
    const panier = new Panier("foobar", [])

    const produit = getProduit()
    panier.ajouterArticle(produit, new Quantite(5))
    panier.incrementerArticle(produit)

    expect(panier.articles[0].produit.sku).toEqual("sku-ref")
    expect(panier.articles[0].quantite).toEqual(new Quantite(6))
  })

  test("doit permettre de décrémenter une quantite de produit", () => {
    const panier = new Panier("foobar", [])

    const produit = getProduit()

    panier.ajouterArticle(produit, new Quantite(5))
    panier.decrementerArticle(produit)

    expect(panier.articles[0].produit.sku).toEqual("sku-ref")
    expect(panier.articles[0].quantite).toEqual(new Quantite(4))
  })

  test("doit retirer l'article de la liste si sa quantite est nulle", () => {
    const p = new Panier("foobar", [])
    const produit = new ProduitBuilder()
      .avecSku("ref1")
      .avecGtin("gtin1")
      .creer()
    p.ajouterArticle(produit, new Quantite(5))

    for (let i = 0; i < 5; i++) {
      p.decrementerArticle(produit)
    }

    expect(p.articles).toEqual([])
  })

  test("doit ajouter un article dans le panier", () => {
    const panier = new Panier("id_panier", [])
    const produit = new ProduitBuilder()
      .avecSku("ref1")
      .avecGtin("gtin1")
      .creer()
    const quantite = new Quantite(1)
    panier.ajouterArticle(produit, quantite)

    expect(panier.articles).toEqual([
      {
        produit: produit,
        quantite: quantite,
      },
    ])
  })

  test("doit ajouter plusieurs articles dans le panier", () => {
    const panier = new Panier("id_panier", [])
    const produit1 = getProduit("ref1")
    const produit2 = getProduit("ref2")
    panier.ajouterArticle(produit1, new Quantite(1))
    panier.ajouterArticle(produit2, new Quantite(2))

    expect(panier.articles).toEqual([
      {
        produit: produit1,
        quantite: new Quantite(1),
      }, {
        produit: produit2,
        quantite: new Quantite(2),
      }
    ])
  })

  test("doit ajouter plusieurs articles de meme reference dans le panier", () => {
    const panier = new Panier("id_panier", [])
    const produit = new ProduitBuilder()
      .avecSku("ref1")
      .avecGtin("gtin1")
      .creer()
    const quantite = new Quantite(1)
    const quantite2 = new Quantite(2)
    panier.ajouterArticle(produit, quantite)
    panier.ajouterArticle(produit, quantite2)

    expect(panier.articles).toEqual([
      {
        produit: produit,
        quantite: new Quantite(3),
      },
    ])
  })

  test("doit retirer un article", () => {
    const panier = new Panier("foobar", [])
    const produit = new ProduitBuilder()
      .avecSku("ref1")
      .avecGtin("gtin1")
      .creer()
    panier.ajouterArticle(produit, new Quantite(5))
    panier.retirerArticle(produit)

    expect(panier.articles).toHaveLength(0)
  })

})

// vim: fdm=indent
