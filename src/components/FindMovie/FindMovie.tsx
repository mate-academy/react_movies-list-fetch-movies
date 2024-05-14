import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';

type Props = {
  title: string;
  setTitle: (newTitle: string) => void;
  movies: Movie[];
  setMovies: (movie: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({
  title,
  setTitle,
  movies,
  setMovies,
}) => {
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const addMovie = (newMovie: Movie) => {
    if (movies.find(movie => movie.imdbId === foundMovie?.imdbId)) {
      setTitle('');
      setFoundMovie(null);

      return;
    }

    setTitle('');
    setFoundMovie(null);
    setErrorMessage('');
    setMovies([...movies, newMovie]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    getMovie(title)
      .then(response => {
        if (response.Response === 'False') {
          setErrorMessage('Can&apos;t find a movie with such a title');
        } else {
          const movieData = response as MovieData;

          setFoundMovie({
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl:
              movieData.Poster !== 'N/A'
                ? movieData.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          });
        }
      })
      .finally(() => setLoading(false));
    setTitle('');
    setFoundMovie(null);
    setErrorMessage('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className={classNames('input', {
                'is-danger': foundMovie === null && errorMessage,
              })}
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setErrorMessage('');
              }}
            />
          </div>

          {!loading && foundMovie === null && errorMessage != '' && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
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
              disabled={!title}
            >
              Find a movie
            </button>
          </div>

          {!loading && foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(foundMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!loading && foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard key={foundMovie.imdbId} movie={foundMovie} />
        </div>
      )}
    </>
  );
};
