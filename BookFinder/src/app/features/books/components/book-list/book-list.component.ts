import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {BookService} from '../../../../core/services/book.service';
import {AsyncPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    SlicePipe,
    RouterLink
  ],
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books$: Observable<any[]> = new Observable();
  private searchSubject = new BehaviorSubject<string>('');
  expandedBooks: { [key: string]: boolean } = {};
  categories: string[] = ['Fiction', 'AI', 'Science', 'Mystery', 'Fantasy', 'History']; // Categories List
  selectedCategory: string = '';
  searchQuery: string = 'bestseller'; // Default search query
  currentPage: number = 0;
  maxResults: number = 15; // Books per page
  favoriteBookIds: Set<string> = new Set(); // ✅ Track favorite books
  totalBooksFetched: number = 0; // ✅ Track the number of books returned

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchBooks();
    from(this.bookService.getFavorites()).subscribe(favorites => {
      this.favoriteBookIds = new Set(favorites.map(fav => fav.bookId)); // ✅ Store favorite book IDs
    });
  }

  fetchBooks(): void {
    let booksObservable: Observable<any[]>;

    if (this.selectedCategory && this.searchQuery !== "*") {
      booksObservable = this.bookService.getBooksByCategoryAndSearchQuery(
        this.searchQuery, this.selectedCategory, this.currentPage * this.maxResults, this.maxResults
      );
    } else if (this.selectedCategory) {
      booksObservable = this.bookService.getBooksByCategory(
        this.selectedCategory, this.currentPage * this.maxResults, this.maxResults
      );
    } else {
      booksObservable = this.bookService.searchBooks(
        this.searchQuery || "*", this.currentPage * this.maxResults, this.maxResults
      );
    }

    booksObservable.subscribe(books => {
      this.books$ = booksObservable;
      this.totalBooksFetched = books.length; // ✅ Store number of books returned
    });
  }

  onCategoryChange(event: Event): void {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.currentPage = 0; // Reset to first page when category changes
    this.fetchBooks();
  }


  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 0; // Reset to first page
    this.fetchBooks();
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchBooks();
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchBooks();
    }
  }


  toggleFavorite(book: any): void {
    if (this.favoriteBookIds.has(book.id)) {
      this.bookService.removeFromFavorites(book.id);
      this.favoriteBookIds.delete(book.id);
    } else {
      this.bookService.addToFavorites(book);
      this.favoriteBookIds.add(book.id);
    }
  }

  isFavorite(bookId: string): boolean {
    return this.favoriteBookIds.has(bookId);
  }

  toggleExpand(bookId: string): void {
    this.expandedBooks[bookId] = !this.expandedBooks[bookId];
  }

}
