import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { DeleteProductAction } from 'src/app/models/interfaces/product/event/DeleteProductAction';
import { EventAction } from 'src/app/models/interfaces/product/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/product/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  public productSelected!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action:string, id?: string):void {
    if (action && action !== '') {
      const productEventData = id && id !== '' ? { action, id } : { action };
      // EMITIR O VALOR DO EVENTO
      this.productEvent.emit(productEventData);
    }
  }

  handleDeleteProduct(product_id: string, product_name: string): void {
    if(product_id !== '' && product_name !== '') {
      this.deleteProductEvent.emit({
        product_id,
        product_name
      })  
    }
  }
}
