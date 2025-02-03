import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs, setDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  register(email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }
  getCurrentUser(): Observable<any> {
    return authState(this.auth);
  }

  // Get user's favorite books from Firestore
  async getFavorites(userId: string): Promise<any[]> {
    const favCollection = collection(this.firestore, 'favorites');
    const q = query(favCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  }

  // Add a book to the user's favorites
  async addToFavorites(userId: string, book: any): Promise<void> {
    const bookId = book.id;
    await setDoc(doc(this.firestore, 'favorites', `${userId}_${bookId}`), {
      userId,
      bookId,
      book
    });
  }

  // Remove a book from the user's favorites
  async removeFromFavorites(userId: string, bookId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'favorites', `${userId}_${bookId}`));
  }
}
