import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  AddMovie: (Movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ AddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function hanldeMovie(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    getMovie(title)
      .then(data => {
        if (data.Response === 'True') {
          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl:
              data.Poster !== 'N/A'
                ? data.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          });
          setError(false);
        } else {
          setError(true);
        }
      })
      .catch(res => {
        throw new Error(res);
      })
      .finally(() => setLoading(false));
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    setError(false);
  }

  function handleAddMovie() {
    if (movie) {
      AddMovie(movie);
      setTitle('');
      setMovie(null);
    }
  }

  // function findMovie() {
  //   const preparedTitle = title.toLowerCase().trim().split(' ').join('-');

  //   getMovie(preparedTitle)
  //     .then(setMovies);
  // }

  return (
    <>
      <form className="find-movie" onSubmit={hanldeMovie}>
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
                'is-info': onfocus,
              })}
              value={title}
              onChange={handleInputChange}
            />
          </div>
          {error && (
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
              className={cn('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={!title}
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
                onClick={handleAddMovie}
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
