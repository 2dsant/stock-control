import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, take, takeUntil } from 'rxjs';
import { DeleteProductAction } from 'src/app/models/interfaces/product/event/DeleteProductAction';
import { EventAction } from 'src/app/models/interfaces/product/event/EventAction';
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  handleProductAction(event: EventAction): void {
    if(event) {
      console.log(event);
    }
  }

  handleDeleteAction(event: DeleteProductAction): void {
    if(event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão do produto: ${event.product_name}?`,
        header: "Confirmação de exclusão",
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id)
      })
    }
  }

  deleteProduct(product_id: string) {
    if(product_id) {
      this.productsService.deleteProduct(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: res => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto removido com sucesso!',
              life: 2500
            });

            this.getAPIProductsData();
          },
          error: err => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover produto!',
              life: 2500
            })
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
