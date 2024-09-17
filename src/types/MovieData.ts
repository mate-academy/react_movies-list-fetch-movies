export interface MovieData {
  Title: string;
  Plot: string;
  Poster: string;
  imdbID: string;
  imdbUrl: string; // Add this property
  Response: 'True' | 'False';
  Error: string;
}
