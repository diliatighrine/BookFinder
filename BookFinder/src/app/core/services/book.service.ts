import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../../shared/models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private googleBooksApiUrl = 'https://www.googleapis.com/books/v1/volumes';
  private apiKey = 'AIzaSyCFtFVHqxUhW_xQNvNt9AqsxMNrv3g7Q5w'; // Replace with your API key
  private favoritesSubject = new BehaviorSubject<Book[]>(this.loadFavoritesFromStorage());
  favorites$ = this.favoritesSubject.asObservable(); // Ensure this is exported and accessible


  constructor(private http: HttpClient) {}

  // Search books using Google Books API
  searchBooks(query: string, startIndex: number = 0, maxResults: number = 15): Observable<any[]> {
    const url = `${this.googleBooksApiUrl}?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.items || [])
    );
  }

  // Get book details by ID
  getBookById(id: string): Observable<any> {
    const url = `${this.googleBooksApiUrl}/${id}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.volumeInfo) // Map to book details
    );
  }
  // Add book to favorites
  addToFavorites(book: any): void {
    const currentFavorites = this.favoritesSubject.value;
    if (!currentFavorites.find((b) => b.id === book.id)) {
      const newFavorites = [...currentFavorites, book];
      this.favoritesSubject.next(newFavorites);
      this.saveFavoritesToStorage(newFavorites);
    }
  }

  // Remove book from favorites
  removeFromFavorites(bookId: string): void {
    const updatedFavorites = this.favoritesSubject.value.filter((book) => book.id !== bookId);
    this.favoritesSubject.next(updatedFavorites);
    this.saveFavoritesToStorage(updatedFavorites);
  }

  // Check if a book is favorited
  isBookFavorite(bookId: string): boolean {
    return this.favoritesSubject.value.some((book) => book.id === bookId);
  }

  // Load favorites from local storage
  private loadFavoritesFromStorage(): any[] {
    const storedFavorites = localStorage.getItem('favoriteBooks');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  // Save favorites to local storage
  private saveFavoritesToStorage(favorites: any[]): void {
    localStorage.setItem('favoriteBooks', JSON.stringify(favorites));
  }
  getFavorites(): any[] {
    return this.favoritesSubject.value; // Return current favorite books list
  }


  getBooksByCategory(category: string, startIndex: number = 0, maxResults: number = 15): Observable<any[]> {
    const url = `${this.googleBooksApiUrl}?q=subject:${category}&startIndex=${startIndex}&maxResults=${maxResults}&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.items || [])
    );
  }

  getBooksByCategoryAndSearchQuery(query: string ,category: string, startIndex: number = 0, maxResults: number = 15): Observable<any[]> {
    const url = `${this.googleBooksApiUrl}?q=${query}+subject:${category}&startIndex=${startIndex}&maxResults=${maxResults}&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.items || [])
    );
  }


}
