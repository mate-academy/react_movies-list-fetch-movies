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
  const [isLiading, setIsloading] = useState(false);
  const [clickedButton, setCklickedButton] = useState(true);

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
    setIsloading(true);
    setCklickedButton(false);

    getMovie(title).then(data => {
      if ('Error' in data) {
        throw new Error('Error');
      }

      setMovieData(data);
    }).catch(() => setError(true))
      .finally(() => setIsloading(false));
  };

  const addNewMovie = () => {
    const findSameMovie = () => {
      let result;

      if (movie !== null) {
        result = moviesList.some((mov: Movie) => mov.imdbId === movie.imdbId);
      }

      return result;
    };

    if (!findSameMovie() && movie !== null) {
      setMoviesList([...moviesList, movie]);
    }

    setMovie(null);
    setQuery('');
    setCklickedButton(true);
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
          isLoading={isLiading}
          clickedButton={clickedButton}
        />
      </div>
    </div>
  );
};
