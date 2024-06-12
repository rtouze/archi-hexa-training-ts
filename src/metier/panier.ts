import { Quantite, Produit, Article, ArticleDTO, Adresse, AdresseDTO, ProduitBuilder} from "./values"

export interface PanierRepository {
  sauver(panier: Panier): Promise<void>
  recuperer(panierId: string): Promise<Panier>
}

export interface PanierPresenter {
  envoyerLigne(ligne: string): void
  envoyerPanier(panier: Panier): void
}

export enum EventType {
  AJOUT,
  SUPPRESSION
}

type PanierEventData = {
  sku: string,
  quantite: number
}

type PanierEvent = {
  timestamp: Date
  type: EventType
  eventData:  PanierEventData
}

export class Panier {
  private adresse?: Adresse

  constructor(
    public readonly id: string,
    public articles: Array<Article> = [],
    private events: Array<PanierEvent> = []
  ) {}

  incrementerArticle(produit: Produit) {
    this.ajouterArticle(produit, new Quantite(1))
    this.events.push({ timestamp: new Date(), type: EventType.AJOUT, eventData: {sku: produit.sku, quantite: 1}})
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

    this.events.push({ timestamp: new Date(), type: EventType.AJOUT, eventData: {sku: produit.sku, quantite: quantite.valeur}})
  }

  visualiser(presenter: PanierPresenter) {
    this.articles.forEach(a => {
      presenter.envoyerLigne(`${a.produit.sku} - ${a.quantite.valeur}`)
    })
  }

  toDto(): PanierDTO {
    const dto: PanierDTO = {
      id: this.id,
      articles: this.articles.map(a => a.toDto()),
      // adresse: {
      //   google_place_id: "google_place",
      //   rue: "23 rue favre",
      //   code_postal: "69006",
      //   ville: "Lyon",
      //   pays: "France"
      // }
    }
    if (this.adresse) {
      dto.adresse = this.adresse.toDto()
    }
    return dto
  }

  ajouterAdresse(adresse:Adresse) {
    this.adresse = adresse
  }

  getEvents(): Array<PanierEvent> {
    return this.events
  }

  static fromEvents(panierId:string, events: Array<PanierEvent>): Panier {

    let articles: Array<Article> = []

    events.forEach(e => {
      if (e.type === EventType.AJOUT) {
        const index = articles.findIndex(a=> a.produit.sku === e.eventData.sku)
        if (index < 0) {
          articles.push(new Article(new ProduitBuilder().avecSku(e.eventData.sku).avecGtin("xxx").creer(), new Quantite(e.eventData.quantite)))
        } else {
          articles[index] = articles[index].ajouterQuantite(new Quantite(e.eventData.quantite))
        }
      }
    })

    return new Panier(panierId, articles)
    
  }
}


export type PanierDTO = {
  id: string
  articles: Array<ArticleDTO>,
  adresse?: AdresseDTO
}

// vim: fdm=indent
