import { Movie } from '../types/Movie';

export const handleAddMovieToList = (
  movies: Movie[],
  newMovie: Movie,
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
  setMovie: React.Dispatch<React.SetStateAction<Movie | null>>,
  setQueryTitle: React.Dispatch<React.SetStateAction<string>>,
) => {
  const copyOfMovies = [...movies];
  const movieAlreadyInList = copyOfMovies.find(movie => {
    return movie.imdbId === newMovie.imdbId;
  });

  if (!movieAlreadyInList) {
    setMovies([...copyOfMovies, newMovie]);
  }

  setMovie(null);
  setQueryTitle('');
};
