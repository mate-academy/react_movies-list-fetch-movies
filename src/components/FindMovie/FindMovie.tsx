import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
  isRepeat: boolean,
  setRepeat: (ans: boolean) => void,
};

export const FindMovie: React.FC<Props> = ({
  addMovie,
  isRepeat,
  setRepeat,
}) => {
  const [query, setQueries] = useState('');
  const [error, setError] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  const newMovie = async () => {
    const findMovie = await getMovie(query);

    if ('Error' in findMovie) {
      setError(true);
      setLoaded(false);
    } else {
      const imgUrl = findMovie.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : findMovie.Poster;

      const movie = {
        title: findMovie.Title,
        description: findMovie.Plot,
        imgUrl,
        imdbId: findMovie.imdbID,
        imdbUrl: `https://www.imdb.com/title/${findMovie.imdbID}`,
      };

      setPreview(movie);
      setLoaded(false);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                {
                  'input is-danger': error,
                },
              )}
              onChange={(e) => {
                setQueries(e.target.value);
                setError(false);
                setRepeat(false);
              }}
            />
          </div>
          {(error && query)
            && (
              <p
                className="help is-danger"
                data-cy="errorMessage"
              >
                Can&apos;t find a movie with such a title
              </p>
            )}
          {isRepeat
            && (
              <p
                className="help is-danger"
                data-cy="errorMessage"
              >
                This movie already exists in the MovieList
              </p>
            )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={query === ''}
              className={classNames(
                'button is-light',
                {
                  'is-loading': isLoaded,
                },
              )}
              onClick={(e) => {
                e.preventDefault();
                setPreview(null);
                setLoaded(true);
                setError(false);
                newMovie();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary button"
              style={
                preview === null
                  ? { opacity: 0, cursor: 'default', transition: '0.5s' }
                  : { opacity: 1, transition: '0.5s' }
              }
              onClick={() => {
                if (preview) {
                  setPreview(null);
                  setQueries('');
                  addMovie(preview);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        <MovieCard movie={preview} />
      </div>
    </>
  );
};
