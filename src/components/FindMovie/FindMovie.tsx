import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addNewMovie:(newMovie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addNewMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearchError, setSearchErrorState] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    getMovie(searchQuery)
      .then(data => {
        if ('Error' in data) {
          setSearchErrorState(true);

          return;
        }

        setNewMovie({
          imdbId: data.imdbID,
          imgUrl: data.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          description: data.Plot === 'N/A'
            ? ''
            : data.Plot,
          title: data.Title,
        });
      }).finally(() => {
        setLoading(false);
      });
  };

  const addMovie = () => {
    if (!newMovie) {
      return;
    }

    addNewMovie(newMovie);
    setSearchQuery('');
    setNewMovie(null);
    setSearchErrorState(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              value={searchQuery}
              className={classNames('input', {
                'is-dander': hasSearchError,
              })}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchErrorState(false);
              }}
            />
          </div>

          {hasSearchError && (
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!searchQuery}
            >
              {newMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {newMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={newMovie} />
          </>
        )}
      </div>
    </>
  );
};
