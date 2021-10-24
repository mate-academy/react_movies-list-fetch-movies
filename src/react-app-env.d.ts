/// <reference types="react-scripts" />

type Movie = {
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
  Response: string;
};

type MovieApi = {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
};
