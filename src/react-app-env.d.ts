/// <reference types="react-scripts" />

interface Movie {
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
}

interface MovieResponse extends Movie {
  Response: string
}
