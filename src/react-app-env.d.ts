/// <reference types="react-scripts" />

interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}

interface FromServer {
  Title: string;
  Plot: string;
  Poster: string;
  imdbID: string;
  Response: string;
}
