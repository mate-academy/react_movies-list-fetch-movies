export interface MovieData {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
  [key: string]: string | number | undefined;
}

export interface ResponseError {
  Response: 'False';
  Error: string;
}
