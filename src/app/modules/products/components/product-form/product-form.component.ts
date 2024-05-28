import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/getCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/product/event/EventAction';
import { CreateProductRequest } from 'src/app/models/interfaces/product/request/CreateProductRequest';
import { GetAllProductsResponse } from 'src/app/models/interfaces/product/response/GetAllProductsResponse';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/service-data-transfer.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{ name: string; code: string }> = [];
  public productAction!: {
    event: EventAction,
    productsData: Array<GetAllProductsResponse>;
  }
  public productSelectedData!: GetAllProductsResponse;
  public productsData!: Array<GetAllProductsResponse>;

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
  });

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productService: ProductService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    public ref: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.productAction = this.ref.data;
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
          }
        },
      });
  }

  handleSubmitAddProduct(): void {
    if(this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: this.addProductForm.value.amount as number
      };

      this.productService.createProduct(requestCreateProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          if(res) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com sucesso!',
              life: 2500
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar produto!',
            life: 2500
          })
        }
      })
    }

    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void {
    // if(this.editProductForm.value && this.editProductForm.valid) {

    // }
  }

  getProductSelectedData(productId: string): void {
    const allProducts = this.productAction?.productsData;

    if(allProducts.length) {
      const productFiltered = allProducts.filter(p => p.id == productId);

      if(productFiltered) {
        this.productSelectedData = productFiltered[0];

        this.editProductForm.setValue({
          name: this.productSelectedData.name,
          price: this.productSelectedData.price,
          amount: this.productSelectedData.amount,
          description: this.productSelectedData.description
        });
      }
    }
  }

  getProductsData(): void {
    this.productService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: res => {
        if(res.length) {
          this.productsData = res;
          this.productsData && this.productsDtService.setProductsDatas(this.productsData);
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
