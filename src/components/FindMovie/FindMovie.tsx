import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from 'react';
import './FindMovie.scss';
import { useQuery } from '@tanstack/react-query';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Loader } from '../Loader';
import { Movie } from '../../types/Movie';

interface Props {
  setMovies: Dispatch<SetStateAction<Movie[]>>
}

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [isAlreadyExist, setIsAlreadyExist] = useState(false);

  const {
    data, fetchStatus, refetch, remove,
  } = useQuery(
    ['movie', query],
    () => getMovie(query), {
      enabled: false,
    },
  );

  const handleAddToList = () => {
    setMovies((prevState) => {
      if (
        data
        && 'title' in data
        && prevState
          .filter((movie) => movie.imdbId === data.imdbId).length === 0) {
        return [data, ...prevState];
      }

      setIsAlreadyExist(true);

      return prevState;
    });
    remove();
    setQuery('');
  };

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsAlreadyExist(false);
  };

  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title:

          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={handleChange}
            />
          </div>

          {isAlreadyExist && (
            <p className="help is-danger" data-cy="errorMessage">
              This movie is already in list!
            </p>
          )}
          {data && 'Error' in data && (
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
              className="button is-light"
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {data && 'title' in data && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToList}
              >
                Add to the list
              </button>
            )}

          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {data && <h2 className="title">Preview</h2>}
        {fetchStatus === 'fetching' && <Loader />}

        {data && 'title' in data && (
          <MovieCard movie={data} />
        )}
      </div>
    </>
  );
};
