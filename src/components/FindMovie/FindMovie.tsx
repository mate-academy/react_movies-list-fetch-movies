/* eslint-disable padding-line-between-statements */
/* eslint-disable no-console */
import React, { useState } from 'react';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { Loader } from '../Loader';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>();
  const [movieError, setMovieError] = useState(false);
  const [isMovie, setIsMovie] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const reset = () => {
    setIsMovie(false);
    setQuery('');
    setMovieError(false);
    setMovie(null);
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    /* коли я роблю cosnt [value] = event.target, в мене горить лінтер, що тип не підходить, а писати any думаю помага ідея */
    setQuery(event.target.value);

    if (event.target.value.length === 0) {
      setMovieError(false);
    }
  };

  const handleMovieSubmit = (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsLoader(true);

    getMovie(query).then((data) => {
      if ('Error' in data) {
        setMovieError(true);

        return;
      }

      // eslint-disable-next-line max-len
      const img = data.Poster === 'N/A'
        ? ('https://via.placeholder.com/360x270.png?text=no%20preview')
        : (data.Poster);

      setMovie({
        title: data.Title,
        description: data.Plot,
        imgUrl: img,
        imdbUrl: img,
        imdbId: data.imdbID,
      });

      console.log(movie);

      setIsMovie(true);
      setMovieError(false);
    }).finally(() => setIsLoader(false));
  };

  const handleBtnChange = () => {
    if (movie) {
      onAdd(movie);
    }

    reset();
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleMovieSubmit}>
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
              onChange={handleInputChange}
            />
          </div>
          {movieError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className="button is-light"
            >
              {isLoader ? (
                <Loader />
              ) : (
                'Find a movie'
              )}
            </button>
          </div>

          <div className="control">
            <button
              onClick={handleBtnChange}
              disabled={!movie}
              data-cy="addButton"
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie && isMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
