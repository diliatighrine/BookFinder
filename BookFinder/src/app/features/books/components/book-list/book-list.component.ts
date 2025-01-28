// src/app/features/books/components/book-list/book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookService } from '../../../../core/services/book.service';
import { Book } from '../../../../shared/models/book.model';
import { Category } from '../../../../shared/models/category.model';
import {BookSearchComponent} from '../book-search/book-search.component';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  standalone: true,
  imports: [
    BookSearchComponent,
    AsyncPipe,
    NgForOf,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books$!: Observable<Book[]>;
  categories$!: Observable<Category[]>;
  filteredBooks$!: Observable<Book[]>;
  isLoading = true;
  error: string | null = null;

  private searchQuery$ = new BehaviorSubject<string>('');
  private selectedCategory$ = new BehaviorSubject<string>('');

  constructor(private bookService: BookService) {
    this.initializeObservables();
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  private initializeObservables(): void {
    this.books$ = this.bookService.getAllBooks();
    this.categories$ = this.bookService.getCategories();

    this.filteredBooks$ = combineLatest([
      this.books$,
      this.searchQuery$,
      this.selectedCategory$
    ]).pipe(
      map(([books, search, category]) => {
        let filtered = books;

        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(book =>
            book.title.toLowerCase().includes(searchLower) ||
            book.author.toLowerCase().includes(searchLower)
          );
        }

        if (category) {
          filtered = filtered.filter(book => book.category === category);
        }

        return filtered;
      })
    );
  }

  private loadBooks(): void {
    this.isLoading = true;
    this.books$.subscribe({
      next: () => {
        this.isLoading = false;
        this.error = null;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load books. Please try again later.';
        console.error('Error loading books:', err);
      }
    });
  }

  onSearch(searchTerm: string): void {
    this.searchQuery$.next(searchTerm);
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory$.next(select.value);
  }

  isBookFavorite(bookId: string): boolean {
    return this.bookService.isBookFavorite(bookId);
  }

  toggleFavorite(book: Book): void {
    if (this.isBookFavorite(book.id)) {
      this.bookService.removeFromFavorites(book.id);
    } else {
      this.bookService.addToFavorites(book);
    }
  }
}
