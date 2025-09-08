import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';

type Props = {
  setMovies: (movie: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function checkMovieAlreadyInList(id: string): boolean {
    return movies.some(mov => mov.imdbId === id);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedTitle = title
      .replace(/[^a-zA-Zа-яА-ЯёЁіїІЇєЄґҐ0-9 ]/g, '')
      .trim();

    setLoading(true);

    getMovie(cleanedTitle)
      .then(data => {
        if ('Response' in data && data.Response === 'False') {
          setErrorMessage("Can't find a movie with such a title");
          setMovie(null);
        } else {
          setErrorMessage('');
          setMovie(data as MovieData);
        }
      })
      .catch(setErrorMessage)
      .finally(() => setLoading(false));
  }

  function mapMovieDataToMovie(data: MovieData): Movie {
    return {
      title: data.Title,
      description: data.Plot,
      imgUrl:
        !data.Poster || data.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : data.Poster,
      imdbId: data.imdbID,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    };
  }

  function addMovie() {
    if (movie && checkMovieAlreadyInList(movie.imdbID)) {
      setMovie(null);
      setTitle('');
      setErrorMessage('');

      return;
    }

    if (movie) {
      setMovies([...movies, mapMovieDataToMovie(movie)]);
    }

    setMovie(null);
    setTitle('');
    setErrorMessage('');
  }

  function changeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    setErrorMessage('');
  }

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              name="title"
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': errorMessage })}
              value={title}
              onChange={changeTitle}
            />
          </div>

          {errorMessage && (
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
              disabled={!title.trim()}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={mapMovieDataToMovie(movie)} />
        </div>
      )}
    </>
  );
};
