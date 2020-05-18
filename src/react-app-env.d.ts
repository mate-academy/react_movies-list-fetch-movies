// eslint-disable-next-line
/// <reference types="react-scripts" />

interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}

interface MovieFormServer {
  Title: string;
  Poster: string;
  Plot: string;
  imdbID: string;
}
