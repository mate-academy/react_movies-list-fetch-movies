import React, { useState, KeyboardEvent, MouseEvent } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard/MovieCard';

interface Props {
  onAddMovie: (movie: Movie) => void
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canFind, setCanFind] = useState<boolean>(true);

  const onSearch = async (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    setIsLoading(true);

    const movieData = await getMovie(query.toLowerCase());

    try {
      if ('Title' in movieData) {
        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = movieData;

        const film: Movie = {
          title: Title,
          description: Plot,
          imgUrl:
            Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovie(film);
      }

      if ('Error' in movieData) {
        setCanFind(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(event);
    }
  };

  const onAdd = (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();

    if (movie) {
      onAddMovie(movie);
      setMovie(null);
    }
  };

  const idDisabled = Boolean(query) || isLoading;

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
              value={query}
              placeholder="Enter a title to search"
              className={`input ${canFind ? '' : 'is-danger'}`}
              onKeyUp={handleKeyUp}
              onChange={(event) => {
                setQuery(event.target.value);
                setCanFind(true);
              }}
            />
          </div>
          {
            !canFind
            && (
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
              className={classNames(
                'button', 'is-light', { 'is-loading': isLoading },
              )}
              onClick={(event) => onSearch(event)}
              disabled={!idDisabled}
            >
              Find a movie
            </button>
          </div>

          {movie
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={onAdd}
                >
                  Add to the list
                </button>
              </div>
            )}
        </div>
      </form>

      {movie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )}
    </>
  );
};
