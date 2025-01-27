import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../../shared/models/book.model';
import { Category } from '../../shared/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = '/api';
  private favoritesSubject = new BehaviorSubject<Book[]>(this.loadFavoritesFromStorage());
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all books
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
  }

  // Get a single book by ID
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  // Get books by category
  getBooksByCategory(category: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/category/${category}`);
  }

  // Search books
  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/search/${query}`);
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  // Add a book to favorites
  addToFavorites(book: Book): void {
    const currentFavorites = this.favoritesSubject.value;
    if (!currentFavorites.find(b => b.id === book.id)) {
      const newFavorites = [...currentFavorites, book];
      this.favoritesSubject.next(newFavorites);
      this.saveFavoritesToStorage(newFavorites);
    }
  }

  // Remove a book from favorites
  removeFromFavorites(bookId: string): void {
    const currentFavorites = this.favoritesSubject.value;
    const newFavorites = currentFavorites.filter(book => book.id !== bookId);
    this.favoritesSubject.next(newFavorites);
    this.saveFavoritesToStorage(newFavorites);
  }

  // Check if a book is in favorites
  isBookFavorite(bookId: string): boolean {
    return this.favoritesSubject.value.some(book => book.id === bookId);
  }

  // Get current favorites
  getFavorites(): Book[] {
    return this.favoritesSubject.value;
  }

  // Private helper methods
  private loadFavoritesFromStorage(): Book[] {
    const storedFavorites = localStorage.getItem('bookFavorites');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  private saveFavoritesToStorage(favorites: Book[]): void {
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
  }
}
