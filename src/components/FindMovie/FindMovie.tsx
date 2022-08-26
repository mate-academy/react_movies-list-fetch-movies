import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  onAddMovies: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasTitleError, setHasTitleError] = useState(false);
  const [sppiner, setSppiner] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const createMovie = (foundMovie: MovieData): Movie => {
      const image = foundMovie.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : foundMovie.Poster;

      return {
        title: foundMovie.Title,
        description: foundMovie.Plot,
        imgUrl: image,
        imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
        imdbId: foundMovie.imdbID,
      };
    };

    getMovie(query)
      .then((response) => {
        if ('Error' in response) {
          setHasTitleError(true);
        } else {
          setMovie(createMovie(response));
        }
      })
      .finally(() => setSppiner(false));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => {
          setSppiner(true);
          handleSubmit(e);
        }}
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
              onChange={({ target }) => {
                setQuery(target.value);
                setHasTitleError(false);
              }}
            />
          </div>

          {hasTitleError && (
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
              className={
                classNames('button is-light', { 'is-loading': sppiner })
              }
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
                onClick={() => {
                  onAddMovies(movie);
                  setMovie(null);
                }}
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
