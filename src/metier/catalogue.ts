import {Produit} from './values'

export interface Catalogue {
  recupererProduit(sku: string): Promise<Produit>
  afficher(): Promise<Array<string>>
}
