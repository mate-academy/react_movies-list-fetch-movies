export interface MovieData {
  Title: string;
  Plot: string;
  Poster: string;
  imdbID: string;
  Response?: 'True' | 'False';
  Error?: string;
}
