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
    return new Quantite(this.valeur +1)
  }

  decrementer(): Quantite {
    return new Quantite(this.valeur -1)
  }
}
