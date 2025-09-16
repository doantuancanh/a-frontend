import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        HttpClientModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with empty fields', () => {
    expect(component.loginForm.value).toEqual({ email: '', password: '' });
  });

  it('should make the email field required', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTrue();
  });

  it('should validate the email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTrue();
  });

  it('should make the password field required', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTrue();
  });

  it('should not call authService.login if the form is invalid', () => {
    component.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call authService.login and navigate on successful login', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');
    emailControl?.setValue('test@example.com');
    passwordControl?.setValue('password');

    authServiceMock.login.and.returnValue(of({ access_token: 'test-token' }));

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show a snackbar message on failed login', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');
    emailControl?.setValue('wrong@example.com');
    passwordControl?.setValue('wrong');

    authServiceMock.login.and.returnValue(of(null));

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith('Invalid email or password', 'Close', { duration: 3000 });
  });

  it('should show a snackbar message on API error', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');
    emailControl?.setValue('test@example.com');
    passwordControl?.setValue('password');

    authServiceMock.login.and.returnValue(throwError(() => new Error('API Error')));

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith('An error occurred. Please try again.', 'Close', { duration: 3000 });
  });
});
