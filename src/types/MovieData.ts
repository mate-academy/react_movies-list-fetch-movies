export interface MovieData {
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
}

export interface ResponseError {
  Response: 'False';
  Error: string;
}
