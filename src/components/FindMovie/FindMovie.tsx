import React, { useState, useCallback } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../react-app-env';

interface Props {
  movies: Movie[];
  onSetMovies: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = React.memo(
  ({ movies, onSetMovies }) => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [query, setQuery] = useState('');
    const [isAddMovieDisabled, setIsAddMovieDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const searchHandler = useCallback(() => {
      const loadMovie = async () => {
        const loadedMovie = await getMovie(query);

        if (loadedMovie.Response === 'True') {
          setSelectedMovie(loadedMovie);
          setErrorMessage('');
        } else {
          setErrorMessage('Can\'t find a movie with such a title');
        }
      };

      setIsAddMovieDisabled(false);
      loadMovie();
    }, [query]);

    return (
      <>
        <form className="find-movie">
          <div className="field">
            <label className="label" htmlFor="movie-title">
              Movie title
            </label>

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={cn(
                  'input',
                  { 'is-danger': errorMessage },
                )}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
              />
            </div>

            {errorMessage && (
              <p className="help is-danger">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                type="button"
                className="button is-light"
                data-cy="find"
                onClick={searchHandler}
              >
                Find a movie
              </button>
            </div>

            <div className="control">
              <button
                type="button"
                className="button is-primary"
                data-cy="add"
                disabled={isAddMovieDisabled}
                onClick={() => {
                  if (movies.every(
                    movie => movie.imdbID !== selectedMovie?.imdbID,
                  )) {
                    if (selectedMovie) {
                      onSetMovies(selectedMovie);
                      setIsAddMovieDisabled(true);
                      setSelectedMovie(null);
                    }

                    setQuery('');
                  }
                }}
              >
                Add to the list
              </button>
            </div>
          </div>
        </form>

        <div className="container">
          <h2 className="title">Preview</h2>
          {(selectedMovie) && (
            <MovieCard movie={selectedMovie} />
          )}
        </div>
      </>
    );
  },
);
