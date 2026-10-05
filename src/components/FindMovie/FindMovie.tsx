import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface AddMovie {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<AddMovie> = ({ addMovie }) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);

    getMovie(title)
      .then(res => {
        if ('Error' in res) {
          setIsError(true);

          return;
        } else {
          const receivedMovie = {
            title: res.Title,
            description: res.Plot,
            imgUrl:
              res.Poster !== 'N/A'
                ? res.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: res.imdbID,
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
          };

          setMovie(receivedMovie);
        }
      })
      .finally(() => setLoading(false));
  }

  function handleAddButtonClick() {
    if (!movie) {
      return;
    }

    addMovie(movie);
    setTitle('');
    setMovie(null);
  }

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
              className="input is-danger"
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!title}
              data-cy="searchButton"
              type="submit"
              className={
                loading ? 'button is-light is-loading' : 'button is-light'
              }
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
                onClick={handleAddButtonClick}
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
