/// <reference types="react-scripts" />

type Movie = {
  title: string;
  imgUrl: string;
  plot: string;
  imdbId: string;
  imdbUrl: string;
};

type NewMovie = {
  Title: string;
  Plot: string;
  Poster: string;
  imdbID: string;
  Response: 'True' | 'False';
};
