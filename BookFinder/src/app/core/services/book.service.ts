import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../../shared/models/book.model';
import {AuthService} from './auth.service';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  collectionData,
  getDocs,
  query,
  where,
  addDoc
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import {Auth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private googleBooksApiUrl = 'https://www.googleapis.com/books/v1/volumes';
  private apiKey = 'AIzaSyCFtFVHqxUhW_xQNvNt9AqsxMNrv3g7Q5w'; // Replace with your API key
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private http = inject(HttpClient);


  // Search books using Google Books API
  searchBooks(query: string, startIndex: number = 0, maxResults: number = 15): Observable<any[]> {
    const url = `${this.googleBooksApiUrl}?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.items || [])
    );
  }

  // Get book details by ID
  getBookById(bookId: string): Observable<any> {
    const url = `${this.googleBooksApiUrl}/${bookId}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.volumeInfo) // Extract book details
    );
  }

  // Add book to favorites
  async addToFavorites(book: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    await addDoc(collection(this.firestore, 'favorites'), {
      userId: user.uid,
      bookId: book.id,
      book: book
    });
  }

  // Remove book from favorites
  async removeFromFavorites(bookId: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    const favCollection = collection(this.firestore, 'favorites');
    const favQuery = query(favCollection, where('userId', '==', user.uid), where('bookId', '==', bookId));
    const querySnapshot = await getDocs(favQuery);

    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(this.firestore, 'favorites', docSnapshot.id));
    });
  }


  getFavorites(): Observable<any[]> {
    return new Observable(observer => {
      const user = this.auth.currentUser;
      if (!user) {
        observer.next([]);
        observer.complete();
        return;
      }

      const favCollection = collection(this.firestore, 'favorites');
      const favQuery = query(favCollection, where('userId', '==', user.uid));

      collectionData(favQuery).subscribe({
        next: (favorites) => observer.next(favorites),
        error: (err) => observer.error(err),
        complete: () => observer.complete()
      });
    });
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
