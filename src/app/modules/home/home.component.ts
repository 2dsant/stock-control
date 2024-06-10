import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/SignupUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy, AfterViewInit{
  @ViewChild('emailInput') public emailInputRef!: ElementRef;
  @ViewChild('passwordInput') public passwordInputRef!: ElementRef;

  private destroy$ = new Subject<void>();
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.emailInputRef.nativeElement.value = 'Seu email aqui';
    this.passwordInputRef.nativeElement.value = 'Sua senha aqui';
  }

  onSubmitLoginForm(): void {
    this.userService.authUser(this.loginForm.value as AuthRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.cookieService.set('USER_INFO', response?.token);
            this.loginForm.reset();
            this.router.navigate(['/dashboard'])
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Bem vindo de volta ${response?.name}`,
              life: 2000
            })
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao fazer login!`,
            life: 2000
          })
          console.log(error);
        }
      })
  }

  onSubmitSignupForm(): void {
    if (this.signupForm.value && this.signupForm.valid) {
      this.userService.signupUser(
        this.signupForm.value as SignUpUserRequest
      ).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            alert('Usuário teste criado com sucesso');
            this.signupForm.reset();
            this.loginCard = true;

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Usuário criado com sucesso!`,
              life: 2000
            })
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao fazer cadastro!`,
            life: 2000
          })

          console.log(error)
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
