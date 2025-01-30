import { Component, OnInit } from '@angular/core';
import {BookService} from '../../../../core/services/book.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-favorites',
  templateUrl: './book-favorites.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./book-favorites.component.scss']
})
export class BookFavoritesComponent implements OnInit {
  favoriteBooks: any[] = []; // ✅ Ensure this variable is defined

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteBooks = this.bookService.getFavorites(); // ✅ Fetch favorite books
  }

  removeFavorite(bookId: string): void {
    this.bookService.removeFromFavorites(bookId);
    this.loadFavorites(); // ✅ Refresh the list after removal
  }
}
