import React, { useState } from 'react';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { getMovie } from '../../api';

interface Props {
  onAdd: (movie: Movie) => void
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(movie);

  // const handleSubmit = useCallback((event) => {
  //   event.preventDefault();
  //   getMovie(query)
  //     .then(response => {
  //       if ('Error' in response) {
  //         setIsError(true);
  //       }

  //       setMovie({
  //         title: response.Title,
  //         description: response.Plot,
  //         imgUrl: response.Poster,
  //         imdbUrl: '',
  //         imdbId: response.imdbID,
  //       });

  //       console.log(response);
  //     });

  //   setQuery('');
  // }, [movie]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    getMovie(query)
      .then(response => {
        if (!response.Title) {
          setIsError(true);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster,
            imdbUrl: '',
            imdbId: response.imdbID,
          });
          setIsError(false);
        }

        // console.log(response);
      })
      .finally(() => setLoading(false));

    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
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
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
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
              data-cy="searchButton"
              type="submit"
              className={cn(
                {
                  'button is-light is-loading': loading,
                  'button is-light': !loading,
                },
              )}
              onClick={handleSubmit}
              disabled={!query}
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
                disabled={!movie}
                onClick={() => {
                  onAdd(movie);
                  setMovie(null);
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie && (
          <h2 className="title">Preview</h2>
        )}
        {movie && <MovieCard movie={movie} />}

      </div>
    </>
  );
};
