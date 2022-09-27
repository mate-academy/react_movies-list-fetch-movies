/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import './FindMovie.scss';

type Props = {
  movies: Movie[],
  handleMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, handleMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isSearched, setIsSearched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleMovieSearch = () => {
    setIsFetching(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setMovie(null);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      })
      .finally(() => {
        setIsFetching(false);
        setIsSearched(true);
      });
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    const hasMovie = movies.find(newMovie => newMovie.title === movie.title);

    if (!hasMovie) {
      handleMovie(movie);
    }

    setQuery('');
    setIsSearched(false);
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie">
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
              className={classNames(
                'input',
                {
                  'is-danger': isSearched && !movie,
                },
              )}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsSearched(false);
              }}
            />
          </div>

          {isSearched && !movie && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button is-light',
                {
                  'is-loading': isFetching,
                },
              )}
              disabled={!query.trim() || (isSearched && !movie) || isFetching}
              onClick={(event) => {
                event.preventDefault();

                handleMovieSearch();
              }}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={(event) => {
                  event.preventDefault();

                  handleAddMovie();
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
