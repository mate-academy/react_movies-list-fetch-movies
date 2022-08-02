import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieCard } from './components/MovieCard';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';
import { Loader } from './components/Loader';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasFound, setHasFound] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const findMovie = async (name: string) => {
    setMovie(null);
    setLoading(true);

    try {
      const movieFromServer: MovieData | ResponseError = await getMovie(name);

      setLoading(false);

      if (movieFromServer.Response === 'True') {
        setMovie({
          title: movieFromServer.Title,
          description: movieFromServer.Plot,
          imgUrl: movieFromServer.Poster,
          imdbUrl: movieFromServer.imdbID,
          imdbId: movieFromServer.imdbID,
        });

        setHasFound(true);
      } else {
        setHasFound(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const containDublicates = () => {
    if (movie) {
      const hasDublicates = movies
        .map(mov => mov.imdbId)
        .includes(movie.imdbId);

      return hasDublicates;
    }

    return false;
  };

  const addToMovieList = () => {
    if (movie && !containDublicates()) {
      setMovies([
        ...movies,
        movie,
      ]);
      setMovie(null);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          findMovie={findMovie}
          onAdd={addToMovieList}
          hasFound={hasFound}
        />
        {loading
          ? <Loader />
          : movie && <MovieCard movie={movie} /> }
      </div>
    </div>
  );
};
