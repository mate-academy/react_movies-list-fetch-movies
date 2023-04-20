import React, { SetStateAction, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[]
  onAddMovie: React.Dispatch<SetStateAction<Movie[]>>,
};

export const FindMovie: React.FC<Props> = ({ onAddMovie, movies }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(query)
      .then(result => {
        if ('Error' in result) {
          setIsError(true);
        } else {
          const {
            Title,
            Plot,
            Poster,
            imdbID,
          } = result;
          const movieImgUrl = Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster;

          const movieToAdd = {
            title: Title,
            description: Plot,
            imgUrl: movieImgUrl,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setNewMovie(movieToAdd);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const addMovieHandler = () => {
    if (!newMovie) {
      return;
    }

    const listHasMovie = movies
      .some((oldMovie) => oldMovie.imdbId === newMovie.imdbId);

    if (!listHasMovie) {
      const newMovies = [...movies];

      newMovies.push(newMovie);

      onAddMovie(newMovies);
    }

    setNewMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={formSubmitHandler}>
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
              onChange={event => {
                setIsError(false);
                setQuery(event.target.value);
              }}
            />
          </div>

          {isError && (
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
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
            >
              {newMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieHandler}
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
