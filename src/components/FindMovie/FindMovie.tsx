import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

interface Props {
  addMovie: (movie: Movie) => void;
  movieFound: Movie | null;
  setMovieFound: (movie: Movie | null) => void;
}

const getMovieFromData: (data: MovieData) => Movie = (data: MovieData) => {
  const imgUrl =
    data.Poster === 'N/A'
      ? `https://via.placeholder.com/360x270.png?text=no%20preview`
      : data.Poster;

  return {
    title: data.Title,
    description: data.Plot,
    imgUrl: imgUrl,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
};

export const FindMovie: React.FC<Props> = ({
  addMovie,
  movieFound,
  setMovieFound,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMovieSearch = () => {
    setLoading(true);
    getMovie(searchQuery)
    .then(data => {
      if ('Error' in data) {
        setErrorMessage(data.Error);
      } else if ('imdbID' in data) {
        setMovieFound(getMovieFromData(data));
        setErrorMessage('');
      }
    })
    .finally(() => setLoading(false));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => {
          e.preventDefault();
          handleMovieSearch();
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
              value={searchQuery}
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': Boolean(errorMessage),
              })}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (errorMessage) {
                  setErrorMessage('');
                }
                setMovieFound(null);
              }}
            />
          </div>

          {errorMessage && (
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
              disabled={!searchQuery}
              className={cn('button', 'is-light', {
                'is-loading': loading,
              })}
            >
              {!loading && `Find a movie`}
            </button>
          </div>

          <div className="control">
            {movieFound && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movieFound !== null) {
                    addMovie(movieFound);
                    setSearchQuery('');
                    setMovieFound(null);
                  }
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movieFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieFound} />
        </div>
      )}
    </>
  );
};
