import { Component, OnInit } from '@angular/core';
import {BookService} from '../../../../core/services/book.service';
import {NgForOf, NgIf} from '@angular/common';
import {from} from 'rxjs';

@Component({
  selector: 'app-book-favorites',
  templateUrl: './book-favorites.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./book-favorites.component.scss']
})
export class BookFavoritesComponent implements OnInit {
  favoriteBooks: any[] = []; // ✅ Ensures this is an array

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    from(this.bookService.getFavorites()).subscribe(favorites => {
      this.favoriteBooks = favorites; // ✅ Assign favorites from Observable
    });
  }

  removeFavorite(bookId: string): void {
    this.bookService.removeFromFavorites(bookId);
    this.favoriteBooks = this.favoriteBooks.filter(book => book.bookId !== bookId); // ✅ Remove locally
  }
}
