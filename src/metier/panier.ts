import { Quantite, Produit, Article, ArticleDTO } from "./values"

export interface PanierRepository {
  sauver(panier: Panier): Promise<void>
  recuperer(panierId: string): Promise<Panier>
}

export interface PanierPresenter {
  envoyerLigne(ligne: string): void
  envoyerPanier(panier: Panier): void
}

export class Panier {
  constructor(
    public readonly id: string,
    public  articles: Array<Article> = []
  ) {}

  incrementerArticle(produit: Produit) {
    this.ajouterArticle(produit, new Quantite(1))
  }

  decrementerArticle(produit: Produit) {
    const index = this.articles.findIndex(a => a.produit.egale(produit))
    this.articles[index] = (this.articles[index].decrementerQuantite())
    if (this.articles[index].quantite.estNulle()) { 
      this.retirerArticle(produit)
    }
  }

  retirerArticle(produit: Produit) {
    const index = this.articles.findIndex(a => a.produit.egale(produit))
    this.articles.splice(index, 1)
  }

  ajouterArticle(produit: Produit, quantite: Quantite) {
    const index = this.articles.findIndex(a => a.produit.egale(produit))
    if (index > -1) {
      const foundArticle = this.articles[index]
      this.articles[index] = foundArticle.ajouterQuantite(quantite)
      return
    }
    this.articles.push(new Article(produit, quantite))
  }

  visualiser(presenter: PanierPresenter) {
    this.articles.forEach(a => {
      presenter.envoyerLigne(`${a.produit.sku} - ${a.quantite.valeur}`)
    })
  }

  toDto(): PanierDTO {
    return {
      id: this.id,
      articles: this.articles.map(a => a.toDto())
    }
  }
}

export type PanierDTO = {
  id: string
  articles: Array<ArticleDTO>
}

// vim: fdm=indent
