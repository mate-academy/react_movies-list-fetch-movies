import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (m: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [movieFromServer, setMovieFromServer] = useState<Movie | null>(null);
  const [errorRequestMessage, setErrorRequestMessage] = useState('');

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorRequestMessage('');
    setQuery(event.target.value);
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    getMovie(query)
      .then((data: MovieData) => {
        const poster =
          data.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : data.Poster;

        const newFilm: Movie = {
          title: data.Title,
          description: data.Plot,
          imgUrl: poster,
          imdbId: data.imdbID,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        };

        setMovieFromServer(newFilm);
      })
      .catch((error: ResponseError) => {
        setErrorRequestMessage(error.Error);
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovieToList = () => {
    setQuery('');
    onAdd(movieFromServer as Movie);
    setMovieFromServer(null);
  };

  return (
    <>
      <form onSubmit={handleSubmitForm} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              onChange={handleChangeInput}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': errorRequestMessage,
              })}
              value={query}
            />
          </div>
          {errorRequestMessage && (
            <p data-cy="errorMessage" className="help is-danger">
              Error occurred: {errorRequestMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', {
                'is-light': query,
                'is-loading': loading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>
          {movieFromServer && (
            <div className="control">
              <button
                onClick={handleAddMovieToList}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movieFromServer && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieFromServer} />
        </div>
      )}
    </>
  );
};
