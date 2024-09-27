import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
  addMovie: (m: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, addMovie }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage(false);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (query.trim() !== '') {
      getMovie(query)
        .then((data: MovieData | ResponseError) => {
          if ('Title' in data) {
            setNewMovie({
              title: data.Title,
              description: data.Plot,
              imgUrl:
                data.Poster === 'N/A'
                  ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                  : data.Poster,
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
              imdbId: data.imdbID,
            });
            setErrorMessage(false);
          } else {
            setErrorMessage(true);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleAddMovie = () => {
    if (newMovie && movies.every(movie => movie.imdbId !== newMovie.imdbId)) {
      const updatedMovies = [...movies, newMovie];

      addMovie(updatedMovies);
    }

    setQuery('');
    setNewMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className="input"
              value={query}
              onChange={handleChangeTitle}
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>
          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
