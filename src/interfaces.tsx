
// import { SetStateAction } from "react";

export interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}


export interface FindMoviePropsType {
  setMovies: (x: []) => void;
  movies: Movie[];
}
