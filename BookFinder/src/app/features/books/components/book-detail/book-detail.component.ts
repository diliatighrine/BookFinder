import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {BookService} from '../../../../core/services/book.service';
import {NgIf, SlicePipe} from '@angular/common';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  standalone: true,
  imports: [
    NgIf,
    SlicePipe
  ],
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book: any;
  isLoading = true;
  errorMessage = '';
  expanded: boolean = false;

  constructor(private bookService: BookService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.bookService.getBookById(bookId).subscribe({
        next: (data) => {
          this.book = data;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Book details could not be loaded.';
          this.isLoading = false;
        }
      });
    }
  }
}
