
export interface PanierRepository {
  sauver(panier: Panier): Promise<void>
  recuperer(panierId: string): Promise<Panier>
}

export class Panier {

  // private items: Array<Item>

  constructor(
    public readonly id:string,
    private references: Array<string>,
    private items: Array<Item>=[]
  ) {
    // this.items = []
  }

  ajouterReference(reference: string) {
    this.references.push(reference)
  }

  retirerReference(reference: string) {
    const index = this.references.findIndex(r => r === reference)
    this.references.splice(index, 1)
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

  ajouterItems(reference: string, quantite: number): void {
    const index= this.items.findIndex(i => i.reference === reference)
    if (index > -1) {
      this.items[index].quantite += quantite
      return
    } 

    this.items.push({reference: reference, quantite:quantite})
  }

  incrementerItem(reference: string) {
    this.ajouterItems(reference, 1)
  }

  decrementerItem(reference: string) {
    const index= this.items.findIndex(i => i.reference === reference)
    this.items[index].quantite -= 1
    if (this.items[index].quantite == 0) {
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
  quantite: number
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
