import { Component, EventEmitter, Output } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent {
  @Output() search = new EventEmitter<string>();
  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.search.emit(value || '');
    });
  }
}
