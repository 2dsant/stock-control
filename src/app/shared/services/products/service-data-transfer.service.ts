import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/product/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  public productsDataEmitter$ = new BehaviorSubject<GetAllProductsResponse[]>([]);
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor() { }

  setProductsDatas(productsData: GetAllProductsResponse[]): void {
    if(productsData) {
      this.productsDataEmitter$.next(productsData);
      this.getProductsDatas();
    }
  }

  getProductsDatas() {
    this.productsDataEmitter$.pipe(
      take(1),
      map((data) => data?.filter(product => product.amount > 0)))
        .subscribe({
          next: (response) => {
            if(response) {
              this.productsDatas = response;
            }
          }
      });

      return this.productsDatas;
  }
}
