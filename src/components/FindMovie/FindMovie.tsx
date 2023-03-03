import React, { useState } from 'react';
import Classnames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

enum Response {
  title = 'Title',
  error = 'Error',
}

type Props = {
  addMovie: (movie:Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [search, setSearch] = useState('');
  const [movie, setMovie] = useState<Movie | {}>({});
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

    if (Response.title in response) {
      setMovie({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster !== 'N/A'
          ? response.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      });
    }

    if (Response.error in response) {
      setMovie(response);
      setError(true);
    }
  };

  const addAndClear = (newMovie: Movie) => {
    addMovie(newMovie);
    setSearch('');
    setMovie({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    requstByMovie();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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

          {'title' in movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addAndClear(movie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {'title' in movie
           && (
             <div className="container" data-cy="previewContainer">
               <h2 className="title">Preview</h2>
               <MovieCard movie={movie} />
             </div>
           )}
    </>
  );
};
