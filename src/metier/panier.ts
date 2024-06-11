import { Quantite, Produit, Article } from "./values"
export interface PanierRepository {
  sauver(panier: Panier): Promise<void>
  recuperer(panierId: string): Promise<Panier>
}

export class Panier {
  constructor(
    public readonly id: string,
    private references: Array<string>,
    private items: Array<Item> = [],
    public articles: Array<Article> = []
  ) {}

  toDTO(): PanierDTO {
    return {
      id: this.id,
      references: this.references.map((r) => r),
    }
  }

  toDTODb(): PanierDTODB {
    return {
      id: this.id,
      references: this.references.map((r) => r),
      items: this.items.map((i) => i.toDTO()),
    }
  }

  getReferences(): Array<string> {
    return this.references.map((r) => r)
  }

  ajouterItems(reference: string, quantite: Quantite): void {
    const index = this.items.findIndex((i) => i.reference === reference)
    if (index > -1) {
      this.items[index].quantite = this.items[index].quantite.ajouter(quantite)
      return
    }

    this.items.push(new Item(reference,quantite))
  }

  incrementerItem(reference: string) {
    this.ajouterItems(reference, new Quantite(1))
  }

  decrementerItem(reference: string) {
    const index = this.items.findIndex((i) => i.reference === reference)
    this.items[index].quantite = this.items[index].quantite.decrementer()
    if (this.items[index].quantite.valeur == 0) {
      this.retirerItem(reference)
    }
  }

  retirerItem(reference: string) {
    const index = this.items.findIndex((i) => i.reference === reference)
    this.items.splice(index, 1)
  }

  getItems(): Array<Item> {
    return this.items
  }

  ajouterArticle(produit: Produit, quantite: Quantite) {
    const index = this.articles.findIndex(a => a.produit.sku == produit.sku)
    if (index > -1) {
      this.articles[index].quantite = this.articles[index].quantite.ajouter(quantite)
      return
    }
    this.articles.push({produit: produit, quantite: quantite})
  }
}

export type ItemDTO = {
  reference: string
  quantite: number
}

export class Item {
  constructor(
    public readonly reference: string,
    public quantite: Quantite,
  ) {}

  toDTO(): ItemDTO {
    return {
      reference: this.reference,
      quantite: this.quantite.valeur,
    }
  }
}

export type PanierDTO = {
  id: string
  references: Array<string>
}

export type PanierDTODB = {
  id: string
  references: Array<string>
  items: Array<ItemDTO>
}

// vim: fdm=indent
