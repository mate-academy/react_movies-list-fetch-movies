import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const initialSubmitStates = {
    isSubmitActive: false,
    isSubmitLoading: false,
    isTextChanged: false,
  };

  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isTitleInvalid, setIsTitleInvalid] = useState(false);
  const [submitStates, setSumbitStates] = useState(initialSubmitStates);
  const [query, setQuery] = useState('');

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSumbitStates(prev => ({ ...prev, isSubmitLoading: true }));

    const movieFromServer = await getMovie(query);

    setSumbitStates(prev => ({ ...prev, isSubmitLoading: false }));

    if ('Error' in movieFromServer) {
      setIsTitleInvalid(true);

      return;
    }

    if (!submitStates.isTextChanged) {
      setSumbitStates(prev => ({ ...prev, isTextChanged: true }));
    }

    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = movieFromServer;

    setNewMovie({
      title: Title,
      description: Plot,
      imdbId: imdbID,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
    });
  };

  const handleInput = (
    { target: { value } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(value);
    setSumbitStates(prev => ({ ...prev, isSubmitActive: Boolean(value) }));

    if (isTitleInvalid) {
      setIsTitleInvalid(false);
    }
  };

  const handleMovieAdd = () => {
    if (!newMovie) {
      return;
    }

    onAdd(newMovie);
    setNewMovie(null);
    setSumbitStates(initialSubmitStates);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearch}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              onChange={handleInput}
            />
          </div>

          {isTitleInvalid && (
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
                'button',
                'is-light',
                {
                  'is-loading': submitStates.isSubmitLoading,
                },
              )}
              disabled={!submitStates.isSubmitActive}
            >
              {submitStates.isTextChanged ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleMovieAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
