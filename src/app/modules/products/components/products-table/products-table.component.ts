import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { EventAction } from 'src/app/models/interfaces/product/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/product/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();

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
}
