export class Quantite {
  public readonly valeur: number

  constructor(valeur: number) {
    if (valeur < 0) {
      throw new Error("Doit etre positif")
    }
    this.valeur = Math.round(valeur)
  }

  ajouter(autre: Quantite): Quantite {
    return new Quantite(this.valeur + autre.valeur)
  }

  soustraire(autre: Quantite): Quantite {
    return new Quantite(Math.max(this.valeur - autre.valeur, 0))
  }

  incrementer(): Quantite {
    return new Quantite(this.valeur + 1)
  }

  decrementer(): Quantite {
    return new Quantite(this.valeur - 1)
  }

  estNulle(): boolean {
    return this.valeur === 0
  }
}

class Photo {}

class IdentifiantProduit {
  constructor(
    public readonly sku: string,
    public readonly gtin: string,
  ) {}
}

export class Produit {
  constructor(
    public readonly sku: string,
    public readonly gtin: string,
    public readonly nom: string,
    public readonly prix: Prix,
    public readonly description?: string,
    public readonly photo?: Photo,
  ) {}

  egale(other: Produit): boolean {
    return this.sku === other.sku
  }

  toDto(): ProduitDTO {
    return {sku:this.sku, gtin: this.gtin}
  }

}

type ProduitDTO = {
  sku: string
  gtin: string
}

type Prix = number

export class ProduitBuilder {
  private sku: string = ""
  private gtin: string = ""
  private nom: string = ""
  private prix: Prix = 0

  avecSku(sku: string): ProduitBuilder {
    this.sku = sku
    return this
  }

  avecGtin(gtin: string): ProduitBuilder {
    this.gtin = gtin
    return this
  }

  creer(): Produit {
    return new Produit(this.sku, this.gtin, this.nom, this.prix)
  }
}

export class Article {
  constructor(
    public readonly produit: Produit,
    public readonly quantite: Quantite,
  ) {}

  decrementerQuantite(): Article {
    return new Article(this.produit, this.quantite.decrementer())
  }

  ajouterQuantite(quantite: Quantite): Article {
    return new Article(this.produit, this.quantite.ajouter(quantite))
  }

  toDto(): ArticleDTO {
    return {
      quantite: this.quantite.valeur,
      produit: this.produit.toDto()
    }
  }
}

export type ArticleDTO = {
  quantite: number
  produit: ProduitDTO
}

// vim: fdm=indent
