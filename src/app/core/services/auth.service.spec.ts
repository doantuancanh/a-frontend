import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('access_token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should store the token on successful login', () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const mockResponse = { access_token: 'test-token' };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.getToken()).toBe('test-token');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/login/access-token`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should return null on failed login', () => {
      const credentials = { email: 'wrong@example.com', password: 'wrong' };

      service.login(credentials).subscribe(response => {
        expect(response).toBeNull();
        expect(service.getToken()).toBeNull();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/login/access-token`);
      expect(req.request.method).toBe('POST');
      req.flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });

  it('should clear the token on logout', () => {
    localStorage.setItem('access_token', 'test-token');
    service.logout();
    expect(service.getToken()).toBeNull();
  });

  it('should return true if authenticated', () => {
    localStorage.setItem('access_token', 'test-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false if not authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });
});

