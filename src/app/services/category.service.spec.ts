import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../models/category';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  const mockCategory: Category = {
    id: 1,
    name: 'Music'
  };

  const mockCategories: Category[] = [
    { id: 1, name: 'Music' },
    { id: 2, name: 'Sports' },
    { id: 3, name: 'Technology' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllCategories', () => {
    it('should return an Observable<Category[]>', () => {
      service.getAllCategories().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
        expect(categories.length).toBe(3);
        expect(categories[0].name).toBe('Music');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories');
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });

    it('should handle empty response', () => {
      service.getAllCategories().subscribe(categories => {
        expect(categories).toEqual([]);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories');
      req.flush([]);
    });

    it('should handle error response', () => {
      service.getAllCategories().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getCategory', () => {
    it('should return an Observable<Category> for valid id', () => {
      service.getCategory(1).subscribe(category => {
        expect(category).toEqual(mockCategory);
        expect(category.id).toBe(1);
        expect(category.name).toBe('Music');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockCategory);
    });

    it('should handle error for invalid id', () => {
      service.getCategory(999).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getCategoryByName', () => {
    it('should return an Observable<Category> for valid name', () => {
      service.getCategoryByName('Music').subscribe(category => {
        expect(category).toEqual(mockCategory);
        expect(category.name).toBe('Music');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/name/Music');
      expect(req.request.method).toBe('GET');
      req.flush(mockCategory);
    });

    it('should handle error for invalid name', () => {
      service.getCategoryByName('InvalidCategory').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/name/InvalidCategory');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle special characters in name', () => {
      const categoryWithSpecialChars: Category = { id: 4, name: 'Music & Arts' };
      
      service.getCategoryByName('Music & Arts').subscribe(category => {
        expect(category).toEqual(categoryWithSpecialChars);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/name/Music%20%26%20Arts');
      req.flush(categoryWithSpecialChars);
    });
  });

  describe('createCategory', () => {
    it('should create a new category and return Observable<Category>', () => {
      const newCategory: Category = {
        name: 'New Category'
      };

      service.createCategory(newCategory).subscribe(category => {
        expect(category).toEqual(mockCategory);
        expect(category.name).toBe('Music');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newCategory);
      req.flush(mockCategory);
    });

    it('should handle validation error', () => {
      const invalidCategory: Category = {
        name: ''
      };

      service.createCategory(invalidCategory).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle duplicate category name error', () => {
      const duplicateCategory: Category = {
        name: 'Music'
      };

      service.createCategory(duplicateCategory).subscribe({
        next: () => fail('should have failed with 409 error'),
        error: (error) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories');
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category and return Observable<Category>', () => {
      const updatedCategory: Category = {
        id: 1,
        name: 'Updated Music'
      };

      service.updateCategory(1, updatedCategory).subscribe(category => {
        expect(category).toEqual(mockCategory);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedCategory);
      req.flush(mockCategory);
    });

    it('should handle error when category not found', () => {
      const updatedCategory: Category = {
        id: 999,
        name: 'Updated Category'
      };

      service.updateCategory(999, updatedCategory).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle validation error during update', () => {
      const invalidCategory: Category = {
        id: 1,
        name: ''
      };

      service.updateCategory(1, invalidCategory).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/1');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category and return Observable<void>', () => {
      service.deleteCategory(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when category not found for deletion', () => {
      service.deleteCategory(999).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle error when category is in use', () => {
      service.deleteCategory(1).subscribe({
        next: () => fail('should have failed with 409 error'),
        error: (error) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/categories/1');
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });
    });
  });

  describe('API URL construction', () => {
    it('should use correct base URL for all endpoints', () => {
      const baseUrl = 'http://localhost:8080/api/categories';
      
      service.getAllCategories().subscribe();
      const getAllReq = httpMock.expectOne(baseUrl);
      expect(getAllReq.request.url).toBe(baseUrl);

      service.getCategory(1).subscribe();
      const getReq = httpMock.expectOne(`${baseUrl}/1`);
      expect(getReq.request.url).toBe(`${baseUrl}/1`);

      service.getCategoryByName('Test').subscribe();
      const getByNameReq = httpMock.expectOne(`${baseUrl}/name/Test`);
      expect(getByNameReq.request.url).toBe(`${baseUrl}/name/Test`);

      service.createCategory({ name: 'Test' }).subscribe();
      const createReq = httpMock.expectOne(baseUrl);
      expect(createReq.request.url).toBe(baseUrl);

      service.updateCategory(1, { id: 1, name: 'Test' }).subscribe();
      const updateReq = httpMock.expectOne(`${baseUrl}/1`);
      expect(updateReq.request.url).toBe(`${baseUrl}/1`);

      service.deleteCategory(1).subscribe();
      const deleteReq = httpMock.expectOne(`${baseUrl}/1`);
      expect(deleteReq.request.url).toBe(`${baseUrl}/1`);

      // Flush all requests
      getAllReq.flush([]);
      getReq.flush(mockCategory);
      getByNameReq.flush(mockCategory);
      createReq.flush(mockCategory);
      updateReq.flush(mockCategory);
      deleteReq.flush(null);
    });
  });
}); 