import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  setMovies: (movies: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [moviesFromServer, setMovieFromServer] = useState<Movie[] | null>(null);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(query)
      .then(movieData => {
        if ('Title' in movieData) {
          const newMovie = {
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl: movieData.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : movieData.Poster,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          };

          setMovieFromServer([newMovie]);
          setError('');
        } else {
          setError('Can\'t find a movie with such a title');
        }
      })
      .catch(() => {
        throw new Error('Failed loading users');
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddCard = () => {
    if (moviesFromServer) {
      const existingMovie = movies
        .find(movie => movie.imdbId === moviesFromServer[0].imdbId);

      if (!existingMovie) {
        setMovies([...movies, ...moviesFromServer]);
      }
    }

    setQuery('');
    setMovieFromServer(null);
  };

  useEffect(() => {
    setError('');
  }, [query]);

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': error })}
              value={query}
              onChange={handleChangeInput}
            />
          </div>
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {!moviesFromServer ? 'Find a movie' : 'Research again'}
            </button>
          </div>

          <div className="control">
            {moviesFromServer && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddCard()}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {moviesFromServer && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {moviesFromServer?.map(movie => (
            <MovieCard key={movie.imdbId} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
};
