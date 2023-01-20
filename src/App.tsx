/* eslint-disable curly */
import { useState, useMemo } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { Movie } from './types/Movie';

export const App = () => {
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [moviesList, setMoviesList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(true);

  useMemo(() => setError(false), [query]);

  useMemo(() => {
    if (movieData !== null) {
      setMovie({
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl: movieData.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : movieData.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      });
    }
  }, [movieData]);

  const getMovieData = (title: string) => {
    setIsLoading(true);
    setIsButtonClicked(false);

    getMovie(title).then(data => {
      if ('Error' in data) {
        throw new Error('Error');
      }

      setMovieData(data);
    }).catch(() => setError(true))
      .finally(() => setIsLoading(false));
  };

  const addNewMovie = () => {
    if (!movie) return;

    const isMovieAlreadyInTheList = moviesList
      .some((mov: Movie) => mov.imdbId === movie.imdbId);

    if (!isMovieAlreadyInTheList) {
      setMoviesList([...moviesList, movie]);
    }

    setMovie(null);
    setQuery('');
    setIsButtonClicked(true);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={moviesList} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          setQuery={setQuery}
          getMovieData={(title: string) => getMovieData(title)}
          isError={error}
          movie={movie}
          addNewMovie={() => addNewMovie()}
          isLoading={isLoading}
          clickedButton={isButtonClicked}
        />
      </div>
    </div>
  );
};
