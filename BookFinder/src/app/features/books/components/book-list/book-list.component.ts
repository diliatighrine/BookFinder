import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
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
  categories: string[] = ['Fiction', 'Non-fiction', 'Science', 'Mystery', 'Fantasy', 'History']; // Categories List
  selectedCategory: string = '';
  searchQuery: string = '*'; // Default search query
  currentPage: number = 0;
  maxResults: number = 15; // Books per page

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    if (this.selectedCategory && this.searchQuery !== "*") {
      this.books$ = this.bookService.getBooksByCategoryAndSearchQuery(this.searchQuery,this.selectedCategory, this.currentPage * this.maxResults, this.maxResults);
    } else if(this.selectedCategory) {
      this.books$ = this.bookService.getBooksByCategory(this.selectedCategory, this.currentPage * this.maxResults, this.maxResults);
    }else{
      this.books$ = this.bookService.searchBooks(this.searchQuery || "*", this.currentPage * this.maxResults, this.maxResults);
    }
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
