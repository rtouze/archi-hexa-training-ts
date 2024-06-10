interface BaseDeTaux {
  recupererTaux(): number;
}

class BaseDeTauxEnMemoire implements BaseDeTaux {
  recupererTaux(): number {
    return 0.2
  }
}

class Discounter {

  private baseDeTaux: BaseDeTaux

  constructor(baseDeTaux: BaseDeTaux) {
    this.baseDeTaux = baseDeTaux
  }

  appliquerReduction(montant: number): number {
    const reduction = this.baseDeTaux.recupererTaux()
    return montant * (1 - reduction)
  }
}


function app() {

  const baseDeTaux = new BaseDeTauxEnMemoire()

  const discounter = new Discounter(baseDeTaux)

  const entree = parseFloat(process.argv[2])

  const nouveauMontant = discounter.appliquerReduction(entree)

  console.log(nouveauMontant)

}

app()
