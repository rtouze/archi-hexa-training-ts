import { describe, expect, test, beforeEach } from "vitest"
import { Panier, PanierPresenter, EventType } from "../metier/panier"
import { Quantite, ProduitBuilder, Produit, Article, Adresse } from "../metier/values"

function getProduit(suffix: string = "ref"): Produit {
  return new ProduitBuilder()
    .avecSku(`sku-${suffix}`)
    .avecGtin(`gtin-${suffix}`)
    .creer()
}

class PanierPresenterDouble implements PanierPresenter{
  public lignes: Array<string> = []
  public panier?: Panier

  envoyerLigne(ligne: string) {
    this.lignes.push(ligne)
  }

  envoyerPanier(panier: Panier) {
    this.panier = panier
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

    const events = panier.getEvents()

    expect(events[0].type).toEqual(EventType.AJOUT) 
    expect(events[0].eventData).toEqual({sku: "sku-ref", quantite: 5}) 
    expect(events[1].type).toEqual(EventType.AJOUT) 
    expect(events[1].eventData).toEqual({sku: "sku-ref", quantite: 1}) 

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

  test("peut generer un dto", () => {
    const panier = new Panier("id_panier", [])
    const produit1 = getProduit("ref1")
    const produit2 = getProduit("ref2")
    panier.ajouterArticle(produit1, new Quantite(1))
    panier.ajouterArticle(produit2, new Quantite(2))

    expect(panier.toDto()).toEqual({
      id: "id_panier",
      articles: [
      {
        produit: produit1.toDto(),
        quantite: 1
      }, {
        produit: produit2.toDto(),
        quantite: 2
      }
      ]})
  })

  test("peut contenir une adresse", () => {
    const panier = new Panier("xxx", [])
    const adresse = new Adresse(
      "google_place",
      "23 rue favre",
      "69006",
      "Lyon",
      "France"
    )
    panier.ajouterAdresse(adresse)
    const dto = panier.toDto()
    expect(dto.adresse).toEqual({
    google_place_id: 
      "google_place",
    rue: "23 rue favre",
    code_postal: "69006",
    ville: "Lyon",
    pays: "France"
    })
  })

  test("peut etre reconstruit a partir des events", () => {
    const events = [
      {
        timestamp: new Date(),
        type: EventType.AJOUT,
        eventData: {
          sku: "ref1",
          quantite: 2
        }
      },
      {
        timestamp: new Date(),
        type: EventType.AJOUT,
        eventData: {
          sku: "ref1",
          quantite: 3
        }
      }
    ]
    const panier = Panier.fromEvents("panierId", events)
    expect(panier.toDto().articles[0].quantite).toEqual(5)
  })
})

// vim: fdm=indent
