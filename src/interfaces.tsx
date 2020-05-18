
export interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}


export interface FindMoviePropsType {
  setMovies: (Movies: Movie[]) => void;
  movies: Movie[];
}
