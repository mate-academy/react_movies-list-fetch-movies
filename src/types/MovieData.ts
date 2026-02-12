export interface MovieData {
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
  Response: 'True';
}

export interface ResponseError {
  Response: 'False';
  Error: string;
}
