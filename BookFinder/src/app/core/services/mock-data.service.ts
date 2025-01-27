// src/app/core/services/mock-data.service.ts
import { createServer, Model, Registry, Request,Response } from 'miragejs';
import Schema from 'miragejs/orm/schema';

// Define model interfaces
interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverImage: string;
  publishedYear: number;
  rating: number;
}

interface Category {
  id: string;
  name: string;
}

// Create a custom Book model
const BookModel = Model.extend({} as Book);
type BookModelType = typeof BookModel;

// Create a custom Category model
const CategoryModel = Model.extend({} as Category);
type CategoryModelType = typeof CategoryModel;

// Define schema types
type AppSchema = {
  book: typeof BookModel;
  category: typeof CategoryModel;
}

// Define your AppRegistry
type AppRegistry = Registry<AppSchema, {}>;

export function initializeMockServer() {
  return createServer({
    models: {
      book: BookModel,
      category: CategoryModel
    },

    seeds(server) {
      // Seed Categories
      const fiction = server.create('category', { id: '1', name: 'Fiction' });
      const nonFiction = server.create('category', { id: '2', name: 'Non-fiction' });
      server.create('category', { id: '3', name: 'Science Fiction' });
      server.create('category', { id: '4', name: 'Mystery' });
      server.create('category', { id: '5', name: 'Biography' });

      // Seed Books
      server.create('book', {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        category: (fiction.attrs as Category).name,
        coverImage: '/assets/images/gatsby.jpg',
        publishedYear: 1925,
        rating: 4.5
      });

      server.create('book', {
        id: '2',
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        description: 'A landmark volume in science writing by one of the great minds of our time.',
        category: (nonFiction.attrs as Category).name,
        coverImage: '/assets/images/brief-history.jpg',
        publishedYear: 1988,
        rating: 4.8
      });

      // Add more sample books
      server.create('book', {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian social science fiction novel that follows the life of Winston Smith.',
        category: (fiction.attrs as Category).name,
        coverImage: '/assets/images/1984.jpg',
        publishedYear: 1949,
        rating: 4.7
      });

      server.create('book', {
        id: '4',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        description: 'The story of teenage alienation and loss of innocence in America.',
        category: (fiction.attrs as Category).name,
        coverImage: '/assets/images/catcher.jpg',
        publishedYear: 1951,
        rating: 4.3
      });
    },

    routes() {
      this.namespace = 'api';

      this.get('/books', (schema: Schema<AppRegistry>) => {
        return schema.all('book');
      });

      this.get('/books/:id', (schema: Schema<AppRegistry>, request: Request) => {
        const book = schema.find('book', request.params['id']);
        return book || new Response(404, {}, { error: 'Book not found' });
      });

      this.get('/books/category/:category', (schema: Schema<AppRegistry>, request: Request) => {
        return schema.where('book', { category: request.params['category'] });
      });

      this.get('/books/search/:query', (schema: Schema<AppRegistry>, request: Request) => {
        const query = request.params['query'].toLowerCase();
        const books = schema.all('book');

        return books.filter((book) => {
          const attrs = book.attrs as Book;
          return attrs.title.toLowerCase().includes(query) ||
            attrs.author.toLowerCase().includes(query);
        });
      });

      this.get('/categories', (schema: Schema<AppRegistry>) => {
        return schema.all('category');
      });
    }
  });
}
