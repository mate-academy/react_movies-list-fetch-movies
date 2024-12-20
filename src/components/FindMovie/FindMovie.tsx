import React, { FormEvent } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movie: Movie | null;
  query: string;
  movies: Movie[];
  setQuery: (value: string) => void;
  setQuerySerch: (value: string) => void;
  onAdd: (newMovie: Movie) => void;
  searchOk: boolean;
  setSearchOk: (value: boolean) => void;
  searchEmpty: boolean;
  setSearchEmpty: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({
  movie,
  query,
  setQuery,
  setQuerySerch,
  onAdd,
  searchOk,
  setSearchOk,
  searchEmpty,
  setSearchEmpty,
  loading,
  setLoading,
}) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim() !== '') {
      setQuerySerch(query);
    }
  };

  const AddToTheList = () => {
    if (movie) {
      onAdd(movie);
    }
  };

  const startSearch = () => {
    setLoading(true);
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
              className={`input ${searchOk ? '' : 'is-danger'}`}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSearchOk(true);
                if (e.target.value !== '') {
                  setSearchEmpty(false);
                } else {
                  setSearchEmpty(true);
                }
              }}
            />
          </div>

          {!searchOk && (
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={searchEmpty}
              onClick={startSearch}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={AddToTheList}
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
