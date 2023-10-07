import React, { useState } from 'react';

import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { useMovies } from '../../contexts/MoviesContext';

const NOT_APPLICABLE = 'N/A';
const IMDB_URL = 'https://www.imdb.com';

export const FindMovie: React.FC = () => {
  const [movies, setMovies] = useMovies();

  const [searchQuery, setSearchQuery] = useState('');
  const [movieFromServer, setMovieFromServer] = useState<Movie | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(searchQuery)
      .then(response => {
        if ('Error' in response) {
          setErrorMessage(response.Error);
        } else {
          const {
            Title, Plot, Poster, imdbID,
          } = response;

          setMovieFromServer({
            title: Title,
            description: Plot,
            imgUrl: Poster === NOT_APPLICABLE
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
            imdbUrl: `${IMDB_URL}/title/${imdbID}`,
            imdbId: imdbID,
          });
        }
      })
      .catch(setErrorMessage)
      .finally(() => setIsLoading(false));
  };

  const handleListAdd = () => {
    if (movieFromServer
        && !movies.some(movie => movie.imdbId === movieFromServer.imdbId)) {
      setMovies(prev => [...prev, movieFromServer]);
    }

    setSearchQuery('');
    setMovieFromServer(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFormSubmit}
      >
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
              className={cn('input', {
                'is-danger': errorMessage,
              })}
              value={searchQuery}
              onChange={handleInputTyping}
            />
          </div>

          {
            errorMessage && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={searchQuery.length === 0}
            >
              {movieFromServer ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {
            movieFromServer && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handleListAdd}
                >
                  Add to the list
                </button>
              </div>
            )
          }
        </div>
      </form>

      {
        movieFromServer && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movieFromServer} />
          </div>
        )
      }
    </>
  );
};
