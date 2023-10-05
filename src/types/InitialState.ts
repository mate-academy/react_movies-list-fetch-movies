import { Movie } from "./Movie";

export type InitialState = [
  movies: Movie[],
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
];
