import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../getMovie';
import { MoviesCard } from '../interfaces';

interface Props {
  hasAlready: boolean;
  addFilm: (newFilm: MoviesCard) => void;
  isNotHasAlready: () => void;
}

const defaultData: Movie = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

export const FindMovie: React.FC<Props> = ({ hasAlready, addFilm, isNotHasAlready }) => {
  const [firstLoaded, serFirstLoaded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorInput, setErrorInput] = useState(false);
  const [isFound, setFindStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMovie, setNewMovie] = useState(defaultData as MoviesCard | null);

  useEffect(() => {
    fetchMovies();
    setErrorInput(false);
  }, []);

  useEffect(() => {
    setSearchStatus();
  }, [isFound, loading, newMovie]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    if (e.target.value) {
      setErrorInput(false);
    } else {
      setErrorInput(true);
    }
  };

  const findMovie = () => {
    serFirstLoaded(false);
    setLoading(true);

    if (!searchQuery) {
      setErrorInput(true);

      return;
    }

    setErrorInput(false);
    isNotHasAlready();

    const preparedValue: string = searchQuery.replace(/ /g, '+');

    getMovie(preparedValue)
      .then((movie) => setNewMovie(movie as MoviesCard))
      .finally(() => setLoading(false));
  };

  const reset = () => {
    setSearchQuery('');
    setNewMovie(null);
    setErrorInput(false);
    setFindStatus(false);
    serFirstLoaded(true);
  };

  const fetchMovies = () => {
    setNewMovie(null);
    setErrorInput(false);
  };

  const setSearchStatus = () => {
    if (!firstLoaded && newMovie && newMovie.title) {
      setFindStatus(true);
      setErrorInput(false);
    } else if (!firstLoaded) {
      setErrorInput(true);
      setFindStatus(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => {
          e.preventDefault();
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={searchQuery}
              placeholder="Enter a title to search"
              className={!loading && errorInput ? 'is-danger input' : 'input'}
              onChange={handleInput}
            />
          </div>
          {!loading && errorInput && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!isFound || errorInput}
              onClick={() => {
                if (newMovie) {
                  addFilm(newMovie);
                }

                reset();
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {loading && (
          <p>Loading...</p>
        )}

        {!loading && newMovie && (
          <MovieCard {...newMovie} />
        )}

        {!loading && !newMovie && hasAlready && (
          <p>This movie already there</p>
        )}

        {!loading && !newMovie && !hasAlready && (
          <p>Please, write correctly title</p>
        )}
      </div>
    </>
  );
};
