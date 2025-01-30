import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import { BookService } from '../../../../core/services/book.service';
import {AsyncPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    SlicePipe
  ],
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books$: Observable<any[]> = new Observable();
  private searchSubject = new BehaviorSubject<string>('');
  expandedBooks: { [key: string]: boolean } = {};

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // Initialize books$ with data from the searchSubject
    this.books$ = this.searchSubject.asObservable().pipe(
      switchMap((query) => this.bookService.searchBooks(query || 'bestseller'))
    );
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }
  toggleFavorite(book: any): void {
    if (this.bookService.isBookFavorite(book.id)) {
      this.bookService.removeFromFavorites(book.id);
    } else {
      this.bookService.addToFavorites(book);
    }
  }

  isFavorite(bookId: string): boolean {
    return this.bookService.isBookFavorite(bookId);
  }

  toggleExpand(bookId: string): void {
    this.expandedBooks[bookId] = !this.expandedBooks[bookId];
  }
}
