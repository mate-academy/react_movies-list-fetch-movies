// eslint-disable-next-line
/// <reference types="react-scripts" />

interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}

interface MovieFromServer {
  Title: string;
  Plot: string;
  Poster: string;
  ImdbUrl: string;
  imdbID: string;
}
