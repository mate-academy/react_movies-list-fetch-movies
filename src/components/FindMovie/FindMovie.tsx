import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  setMovies: (x: Movie[]) => void
  movies: Movie[]
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [titleField, setTitleField] = useState('');
  // eslint-disable-next-line max-len
  const [movieFromServer, setMovieFromServer] = useState<Movie>({
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  });

  const [errorSearch, setErrorSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addToList, setAddToList] = useState(true);

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
              value={titleField}
              onChange={(e) => {
                setErrorSearch(false);
                setTitleField(e.target.value);
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
              onClick={(e) => {
                e.preventDefault();
                setIsLoading(true);
                getMovie(titleField)
                  .then(movie => {
                    if ('Error' in movie) {
                      setErrorSearch(true);
                      setIsLoading(false);

                      return Promise.reject();
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

                    return Promise.resolve();
                  });
              }}
              disabled={Boolean(!titleField)}
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
              onClick={(e) => {
                e.preventDefault();
                setAddToList(true);

                // eslint-disable-next-line max-len
                if (!movies.some(movie => movie.title === movieFromServer.title)) {
                  setMovies([...movies, movieFromServer]);
                }

                setTitleField('');

                setMovieFromServer({
                  title: '',
                  description: '',
                  imgUrl: '',
                  imdbUrl: '',
                  imdbId: '',
                });
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movieFromServer.title && <MovieCard movie={movieFromServer} />}
      </div>
    </>
  );
};
