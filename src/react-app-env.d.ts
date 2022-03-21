/// <reference types="react-scripts" />

export type Movie = {
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
};

export type AddMovie = {
  addMovie: (movie: Movie) => void,
};
