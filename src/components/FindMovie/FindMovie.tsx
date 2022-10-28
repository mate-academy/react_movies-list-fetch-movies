import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';

const defaultImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  addMovie: (movie: Movie) => void
};

interface FindMovieState {
  movie: Movie | null;
  searchTitle: string;
  isMovieLoading: boolean;
  isLoadingErr: boolean;
}

const initialState: FindMovieState = {
  movie: null,
  searchTitle: '',
  isMovieLoading: false,
  isLoadingErr: false,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [state, setState] = useState<FindMovieState>(initialState);

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(prevState => ({
      ...prevState,
      isMovieLoading: true,
    }));

    getMovie(state.searchTitle)
      .then(response => {
        if ('Error' in response) {
          setState(prevState => ({
            ...prevState,
            isLoadingErr: true,
          }));
        } else {
          const movie = {
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster !== 'N/A' ? response.Poster : defaultImg,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          };

          setState(prevState => ({
            ...prevState,
            movie,
          }));
        }
      })
      .finally(() => setState(prevState => ({
        ...prevState,
        isMovieLoading: false,
      })));
  };

  const handelAddBtn = () => {
    if (state.movie !== null) {
      addMovie(state.movie);
    }

    setState(initialState);
  };

  const handelSearchChange = (searchTitle: string) => {
    setState(prevState => ({
      ...prevState,
      searchTitle,
      isLoadingErr: false,
    }));
  };

  return (
    <>
      <form className="find-movie" onSubmit={handelSubmit}>
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
              value={state.searchTitle}
              onChange={(event) => handelSearchChange(event.target.value)}
            />
          </div>
          {state.isLoadingErr && (
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
                { 'is-loading': state.isMovieLoading },
              )}
              disabled={!state.searchTitle}
            >
              { state.movie !== null
                ? 'Search again'
                : 'Find a movie' }
            </button>
          </div>

          {state.movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handelAddBtn}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {(state.movie !== null) && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={state.movie} />
        </div>
      )}
    </>
  );
};
