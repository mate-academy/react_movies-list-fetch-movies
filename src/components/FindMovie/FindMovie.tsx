import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  onMovieAdd: (movie: Movie) => void;
}

// eslint-disable-next-line max-len
const defaultImage = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieIsNotFound, setMovieIsNotFound] = useState(false);
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState(false);

  const findMovie = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(movieTitle)
      .then((result) => {
        if ('Error' in result) {
          setMovieIsNotFound(true);
        } else {
          const {
            Title,
            Plot,
            Poster,
            imdbID,
          } = result;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster !== 'N/A'
              ? Poster
              : defaultImage,
            imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
            imdbId: imdbID,
          });
        }
        // setMovie({
        //   title: Title,
        //   description: Plot,
        //   imgUrl: Poster !== 'N/A'
        //     ? Poster
        //     : defaultImage,
        //   imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
        //   imdbId: imdbID,
        // });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => findMovie(event)}
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
              value={movieTitle}
              onChange={event => {
                setMovieTitle(event.target.value);
                setMovieIsNotFound(false);
              }}
            />
          </div>

          {movieIsNotFound && (
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
                {
                  'is-loading': loading,
                  'is-light': !loading,
                },
              )}
              disabled={!movieTitle.length}
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
                onClick={() => {
                  onMovieAdd(movie);
                  setMovieTitle('');
                  setMovie(undefined);
                }}
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
