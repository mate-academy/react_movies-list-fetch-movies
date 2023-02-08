import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import './FindMovie.scss';

type Props = {
  movie: Movie | null;
  setFoundMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  addMovies: () => void;
};

export const FindMovie: React.FC<Props> = ({
  movie,
  setFoundMovie,
  addMovies,
}) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const getNormalizedMovie = (movieData: MovieData): Movie => {
    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: movieData.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieData.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    };
  };

  const searchHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearching(true);

    try {
      const foundMovie = await getMovie(query);
      let normalizedMovie = null;

      if ('Error' in foundMovie) {
        if (foundMovie.Error === 'Movie not found!') {
          setNotFound(true);
        }
      } else {
        normalizedMovie = getNormalizedMovie(foundMovie);
      }

      setFoundMovie(normalizedMovie);
    } finally {
      setSearching(false);
    }
  };

  const onChangeHandler = (value: string) => {
    setQuery(value);

    if (notFound) {
      setNotFound(false);
    }
  };

  const handlerAddMovie = () => {
    setQuery('');
    addMovies();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={searchHandler}
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
              onChange={(event) => onChangeHandler(event.target.value)}
            />
          </div>

          {notFound && (
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
                'is-light',
                { 'is-loading': searching },
              )}
              disabled={!query}

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
                onClick={handlerAddMovie}
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
