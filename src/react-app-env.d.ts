/// <reference types="react-scripts" />

type Movie = {
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
};

type AddMovieToList = (movie: Movie | null) => void;
