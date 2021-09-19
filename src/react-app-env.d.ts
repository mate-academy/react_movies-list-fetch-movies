/// <reference types="react-scripts" />

type MovieApi = {
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
  Response: string;
};

type Movie = {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
};
