import React, { useState, useCallback } from 'react';
import { getMovieListFromServer } from '../../api/api';
import { MovieCard } from '../MovieCard';

import { Movie } from '../../react-app-env';
import './FindMovie.scss';

interface Props {
  allMovies: Movie[];
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({
  allMovies,
  onAddMovie,
}) => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [movieRequest, setMovieRequest] = useState<string>('');
  const [findError, setFindError] = useState<boolean>(false);
  const [addedToList, setAddedToList] = useState<boolean>(false);

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFindError(false);
    setCurrentMovie(null);
    setMovieRequest('');

    if (currentMovie) {
      onAddMovie(currentMovie);
    }

    if (allMovies.some(movie => (
      movie.imdbID === currentMovie?.imdbID
    ))) {
      setAddedToList(true);
    } else {
      setAddedToList(false);
    }
  };

  const findMoveBtn = useCallback(async () => {
    try {
      const searchFilms = (
        await getMovieListFromServer(movieRequest)
      );

      setCurrentMovie(searchFilms);
    } catch (error) {
      setFindError(true);
    }
  }, [movieRequest]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSubmitForm}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={movieRequest}
              onChange={(event) => {
                setMovieRequest(event.target.value);
                setFindError(false);
              }}
            />
          </div>

          {findError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              data-cy="find"
              className="button is-light"
              onClick={() => findMoveBtn()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              data-cy="add"
              className="button is-primary"
              disabled={!currentMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {currentMovie && (
          <MovieCard movie={currentMovie} />
        )}

        {addedToList && (
          <span>
            Film has already Added!
          </span>
        )}
      </div>
    </>
  );
};
