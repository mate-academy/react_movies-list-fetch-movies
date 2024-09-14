import { FC, ChangeEvent, FormEvent, useState } from 'react';
import cn from 'classnames';

import { getMovie } from '../../api';

import { Movie } from '../../types/Movie';

import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

interface Props {
  onAddMovie: (newMovie: Movie) => void;
}

type ComponentState = {
  query: string;
  isError: boolean;
  isLoading: boolean;
  findMovie: null | Movie;
};

export const FindMovie: FC<Props> = ({ onAddMovie }) => {
  const [findState, setFindState] = useState<ComponentState>({
    query: '',
    isError: false,
    isLoading: false,
    findMovie: null,
  });

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFindState(prevState => ({
      ...prevState,
      query: event.target.value,
      isError: prevState.isError ? false : prevState.isError,
    }));
  };

  const handleMovieAdd = () => {
    if (findState.findMovie) {
      onAddMovie(findState.findMovie);
      setFindState(prevState => ({
        ...prevState,
        findMovie: null,
        query: '',
      }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    setFindState(prevState => ({ ...prevState, isLoading: true }));

    getMovie(findState.query)
      .then(result => {
        if ('Error' in result) {
          setFindState(prevState => ({ ...prevState, isError: true }));
        } else {
          const newMovie: Movie = {
            title: result.Title,
            description: result.Plot,
            imgUrl:
              result.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : result.Poster,
            imdbUrl: 'https://www.imdb.com/title/' + result.imdbID,
            imdbId: result.imdbID,
          };

          setFindState(prevState => ({ ...prevState, findMovie: newMovie }));
        }
      })
      .then(() => {
        setFindState(prevState => ({ ...prevState, isLoading: false }));
      });
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
              className={cn('input', {
                'is-danger': findState.isError,
              })}
              value={findState.query}
              onChange={handleQueryChange}
            />
          </div>

          {findState.isError && (
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
              className={cn('button is-light', {
                'is-loading': findState.isLoading,
              })}
              disabled={!findState.query.trim()}
            >
              {!findState.isLoading && !findState.isError && !findState.query
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          {findState.findMovie && (
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

      {findState.findMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findState.findMovie} />
        </div>
      )}
    </>
  );
};
