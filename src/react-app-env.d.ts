/// <reference types="react-scripts" />

type ApiMovie = {
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
  Response: 'True' | 'False';
};

type Movie = {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
};
