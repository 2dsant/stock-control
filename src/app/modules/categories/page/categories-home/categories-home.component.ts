import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/event/DeleteCategoryAction';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/getCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/product/event/EventAction';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesData: Array<GetCategoriesResponse> = [];
  private ref!: DynamicDialogRef;

  constructor(
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          if (res.length) {
            this.categoriesData = res;
          }
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar categorias!',
            life: 2500
          });

          this.router.navigate(['/dashboard'])
        }
      })
  }

  handleDeleteCategoryAction(event: DeleteCategoryAction): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirma a exclusão da categoria ${event?.categoryName}`,
        header: 'Confirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteCategory(event?.category_id)
      })
    }
  }

  deleteCategory(category_id: string) {
    if (category_id) {
      this.categoriesService.deleteCategory({ category_id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: res => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Categoria removida com sucesso',
              life: 2500
            });
          },
          error: res => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover categoria',
              life: 2500
            });
          },
          complete: () => this.getAllCategories(),
        })
    }
  }

  handleCategoryAction(event: EventAction): void {
    if(event) {
      this.ref = this.dialogService.open(CategoryFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event
        },
      });

      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAllCategories(),
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 
