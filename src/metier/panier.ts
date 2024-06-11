import { Quantite } from './values'
export interface PanierRepository {
  sauver(panier: Panier): Promise<void>
  recuperer(panierId: string): Promise<Panier>
}

export class Panier {
  constructor(
    public readonly id:string,
    private references: Array<string>,
    private items: Array<Item>=[]
  ) {
  }

  toDTO(): PanierDTO {
    return {
      id: this.id,
      references: this.references.map(r => r),
    }
  }

  toDTODb(): PanierDTODB {
    return {
      id: this.id,
      references: this.references.map(r => r),
      items: this.items.map(i => i)
    }
  }

  getReferences(): Array<string> {
    return this.references.map(r => r)
  }

  // ajouterItems(reference: string, quantite: number): void {
  //   // TODO deprecated
  //   const index= this.items.findIndex(i => i.reference === reference)
  //   if (index > -1) {
  //     this.items[index].quantite = this.items[index].quantite.ajouter(new Quantite(quantite))
  //     return
  //   } 

  //   this.items.push({reference: reference, quantite: new Quantite(quantite)})
  // }

  ajouterItems(reference: string, quantite: Quantite): void {
    const index= this.items.findIndex(i => i.reference === reference)
    if (index > -1) {
      this.items[index].quantite = this.items[index].quantite.ajouter(quantite)
      return
    } 

    this.items.push({reference: reference, quantite:quantite})
  }

  incrementerItem(reference: string) {
    this.ajouterItems(reference, new Quantite(1))
  }

  decrementerItem(reference: string) {
    const index= this.items.findIndex(i => i.reference === reference)
    this.items[index].quantite = this.items[index].quantite.decrementer()
    if (this.items[index].quantite.valeur == 0) {
      this.retirerItem(reference)
    }
  }

  retirerItem(reference:string) {
    const index= this.items.findIndex(i => i.reference === reference)
    this.items.splice(index,1)
  }

  getItems():Array<Item> {
    return this.items
  }
}

type Item = {
  reference: string,
  quantite: Quantite
}

export type PanierDTO = {
  id: string
  references: Array<string>
}

export type PanierDTODB = {
  id: string
  references: Array<string>
  items: Array<Item>
}

// vim: fdm=indent
