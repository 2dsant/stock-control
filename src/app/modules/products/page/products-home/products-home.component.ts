import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/product/response/GetAllProductsResponse';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/service-data-transfer.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: ['./products-home.component.scss']
})
export class ProductsHomeComponent implements OnDestroy, OnInit {
  private readonly destroy$: Subject<void> = new Subject();
  public productsData: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getServiceProductsData();
  }

  getServiceProductsData() {
    const productsLoaded = this.productsDtService.getProductsDatas();

    if(productsLoaded.length) {
      this.productsData = productsLoaded;
    } else {
      this.getAPIProductsData();
    }

    console.log('DADOS DE PRODUTOS', this.productsData)
  }

  getAPIProductsData() {
    this.productsService.getAllProducts().pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          if(res.length) {
            this.productsData = res;
          }
        },
        error: err => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500
          })
          this.router.navigate(['/dashboard']);
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
