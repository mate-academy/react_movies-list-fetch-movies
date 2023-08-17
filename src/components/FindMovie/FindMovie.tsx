import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [valueTitleMovie, setValueTitleMovie] = useState('');
  const [moviePreview, setMovePreview] = useState<Movie | null>(null);
  const [load, setLoad] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleChangeTitleMovie = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValueTitleMovie(event.target.value);
    setHasError(false);
  };

  const handleClickSearchMovie = () => {
    setLoad(true);
    getMovie(valueTitleMovie.trim())
      .then(movieData => {
        if (movieData.Response === 'False') {
          setHasError(true);

          return;
        }

        setHasError(false);

        setMovePreview({
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl: movieData.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        });
      })
      .finally(() => setLoad(false));
  };

  const handleClickAddMovie = (movie: Movie) => {
    onAddMovie(movie);
    setMovePreview(null);
    setValueTitleMovie('');
  };

  return (
    <>
      <form onSubmit={event => event.preventDefault()} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={valueTitleMovie}
              onChange={handleChangeTitleMovie}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${hasError && 'is-danger'}`}
            />
          </div>

          {hasError && (
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
              className={`button ${load ? 'is-loading' : 'is-light'}`}
              disabled={!valueTitleMovie}
              onClick={handleClickSearchMovie}
            >
              {moviePreview ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {moviePreview && (
            <div className="control">
              <button
                onClick={() => handleClickAddMovie(moviePreview)}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {moviePreview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={moviePreview} />
        </div>
      )}
    </>
  );
};
