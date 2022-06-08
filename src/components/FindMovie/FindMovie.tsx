import React, { useState, Dispatch, SetStateAction } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { MovieCard } from '../MovieCard';

const baseURL = 'https://www.omdbapi.com/?apikey=314cbfea&t=';

type Props = {
  movies: Movie[];
  setMovies: Dispatch<SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [movieTitle, setMovieTitle] = useState('');
  const [movieFromServer, setMovieFromServer] = useState<Movie | null>(null);
  const [showError, setShowError] = useState('');

  async function loadMovie() {
    if (!movieTitle.trim()) {
      setShowError('Enter the title to search');

      return;
    }

    try {
      setIsLoading(true);
      const result = await fetch(`${baseURL}${movieTitle.trim().toLocaleLowerCase()}`);
      const data = await result.json();

      setIsLoading(false);

      if (data.Response === 'False') {
        throw new Error('Movie not found!');
      }

      setMovieFromServer(data);
    } catch (error) {
      setIsLoading(false);
      setMovieFromServer(null);
      setShowError(`Error: ${error}`);
    }
  }

  function addMovieToList() {
    if (movies.some(movie => movie.imdbID === movieFromServer?.imdbID)) {
      setShowError('This movie already in the list!');

      return;
    }

    if (movieFromServer) {
      setMovies([...movies, movieFromServer]);
      setMovieFromServer(null);
      setMovieTitle('');
    }
  }

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>
          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input ',
                { 'is-danger': showError },
              )}
              value={movieTitle}
              onChange={(e) => {
                setMovieTitle(e.target.value);
                setShowError('');
              }}
            />
          </div>
          {showError && (
            <p className="help is-danger">
              {showError}
            </p>
          )}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={loadMovie}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToList}
              data-cy="add"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <div className="container">
        <h2 className="title">Preview</h2>
        {isLoading && <LoadingSpinner />}
        {movieFromServer && <MovieCard movie={movieFromServer} />}
      </div>
    </>
  );
};
