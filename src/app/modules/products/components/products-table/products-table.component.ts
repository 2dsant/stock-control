import { Component, Input } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/models/interfaces/product/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = [];
  public productSelected!: GetAllProductsResponse;
}
