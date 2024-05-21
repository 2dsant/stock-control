import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/product/response/GetAllProductsResponse';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/service-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  public productsList: Array<GetAllProductsResponse> = [];

  constructor( 
    private productService: ProductService,
    private messageService: MessageService,
    private productsDtService: ProductsDataTransferService
  ){ }

  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData() {
    this.productService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: res => {
        if(res.length) {
          console.log(res);
          this.productsList = res;
          this.productsDtService.setProductsDatas(this.productsList);
        }
    },
      error: err => {
        console.log(err);

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos!',
          life: 2500,
        })
      }
    })
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }
}
