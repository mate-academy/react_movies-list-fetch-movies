import React, { useState } from 'react';
import Classnames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie:Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [search, setSearch] = useState('');
  const [answear, setAnswear] = useState<Movie | {} | ResponseError>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const onChangeHandel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    if (error) {
      setError(false);
    }
  };

  const requstByMovie = async () => {
    setIsLoading(true);
    const response = await getMovie(search);

    setIsLoading(false);

    if ('Title' in response) {
      console.log(response.Poster);
      setAnswear({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster !== 'N/A'
          ? response.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      });
    }

    if ('Error' in response) {
      setAnswear(response);
      setError(true);
    }
  };

  const addAndClear = (movie: Movie) => {
    addMovie(movie);
    setSearch('');
    setAnswear({});
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          requstByMovie();
        }}
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
              value={search}
              onChange={onChangeHandel}
            />
          </div>

          {error ? (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          ) : ''}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={Classnames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={search === ''}
            >
              Find a movie
            </button>
          </div>

          {'title' in answear && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addAndClear(answear)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {'title' in answear
           && (
             <div className="container" data-cy="previewContainer">
               <h2 className="title">Preview</h2>
               <MovieCard movie={answear} />
             </div>
           )}
    </>
  );
};
