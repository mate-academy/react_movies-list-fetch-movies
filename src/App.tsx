import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieData, setMovieData]
    = useState<MovieData | ResponseError>({
      Response: 'False',
      Error: '',
    });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let response: Movie;

    if ('Title' in movieData) {
      response = {
        description: movieData.Plot,
        imgUrl: movieData.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : movieData.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
        title: movieData.Title,
      };

      setMovie(response);
      setError('');
    } else {
      setError(movieData.Error);
    }
  }, [movieData]);

  const findMovieProps
    = (data: string): void => {
      setIsLoading(true);
      getMovie(data).then(setMovieData).finally(() => setIsLoading(false));
    };

  const currentMovie = movie as Movie;

  const onAdd = () => {
    if (!movies.find(
      selectedMovie => selectedMovie.imdbId === currentMovie.imdbId,
    )) {
      setMovies([...movies, currentMovie]);
      setMovie(null);
    } else {
      setMovie(null);
    }
  };

  const clearErrorMessage = () => {
    setError('');
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onSearch={findMovieProps}
          movie={movie}
          error={error}
          onAdd={onAdd}
          isLoading={isLoading}
          clearErrorMessage={clearErrorMessage}
        />
      </div>
    </div>
  );
};
