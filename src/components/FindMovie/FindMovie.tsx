import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
  movies: Movie[]
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [title, setTitle] = useState('');
  // eslint-disable-next-line max-len
  const [movieFromServer, setMovieFromServer] = useState<Movie | null>(null);

  const [errorSearch, setErrorSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addToList, setAddToList] = useState(true);

  // functions

  const submitMovie = (e: any) => {
    e.preventDefault();

    setIsLoading(true);
    getMovie(title)
      .then(movie => {
        if ('Error' in movie) {
          setErrorSearch(true);
          setIsLoading(false);

          return;
        }

        setAddToList(false);
        setErrorSearch(false);
        setIsLoading(false);
        setMovieFromServer({
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster === 'N/A'
            // eslint-disable-next-line max-len
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        });
      });
  };

  const addButton = (e: any) => {
    e.preventDefault();
    setAddToList(true);

    // eslint-disable-next-line max-len
    if (movieFromServer) {
      if (!movies.some(movie => {
        return movie.imdbId === movieFromServer.imdbId;
      })) {
        setMovies([...movies, movieFromServer]);
      }
    }

    setTitle('');

    setMovieFromServer({
      title: '',
      description: '',
      imgUrl: '',
      imdbUrl: '',
      imdbId: '',
    });
  };

  return (
    <>
      <form className="find-movie">
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
              value={title}
              onChange={(e) => {
                setErrorSearch(false);
                setTitle(e.target.value);
              }}
            />
          </div>

          {errorSearch && (
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
                { 'is-loading': isLoading },
              )}
              onClick={submitMovie}
              disabled={!title}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className={classNames(
                'button',
                'is-primary',
                { 'is-hidden': addToList },
              )}
              onClick={addButton}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movieFromServer
        && movieFromServer.title
        && <MovieCard movie={movieFromServer} />}
      </div>
    </>
  );
};
