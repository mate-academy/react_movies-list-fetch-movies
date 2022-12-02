import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsloadig] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const clearForm = () => {
    setQuery('');
    setIsError(false);
    setMovie(null);
  };

  const handleOnAdd = (newMovie: Movie) => {
    onAdd(newMovie);
    clearForm();
  };

  const searchMovie = () => {
    const noImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

    setIsloadig(true);
    getMovie(query)
      .then((data) => {
        if ('Error' in data) {
          setIsError(true);
        } else {
          setMovie({
            title: data.Title,
            description: data.Plot,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
            imgUrl: data.Poster === 'N/A' ? noImg : data.Poster,
          });
        }
      })
      .finally(() => setIsloadig(false));

    clearForm();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => e.preventDefault()}
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsError(false);
              }}
            />
          </div>
          { isError && (
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
              className={
                classNames('button is-light', { 'is-loading': isLoading })
              }
              onClick={searchMovie}
              disabled={!query.trim().length}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleOnAdd(movie)}
              >
                Add to the list
              </button>
            )}
          </div>
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
