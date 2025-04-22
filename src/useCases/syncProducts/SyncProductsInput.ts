type Product = {
  uuid: string;
  name: string;
  price: number;
};

export interface SyncProductsInput {
  products: Product[];
}
