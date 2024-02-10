import { Movie } from './Movie';

export interface MovieData extends Movie{
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
}
