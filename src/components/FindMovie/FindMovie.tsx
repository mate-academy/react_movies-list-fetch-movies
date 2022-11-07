import cn from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
// import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const applyQuery = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHasError(false);
    setQuery(event.target.value);
  };

  const clearForm = () => {
    setQuery('');
    setFindedMovie(null);
  };

  const handleAddMovie = () => {
    if (findedMovie) {
      addMovie(findedMovie);
    }

    clearForm();
  };

  const findMovie = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setLoading(true);

    let movieFromApi: MovieData | null = null;

    try {
      movieFromApi = await getMovie(query);
    } catch (error) {
      setHasError(true);
    } finally {
      setLoading(false);
    }

    if (!movieFromApi) {
      return;
    }

    const {
      Poster,
      Title,
      Plot,
      imdbID,
    } = movieFromApi;

    const movieFromServer = {
      title: Title,
      description: Plot,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };

    setFindedMovie(movieFromServer);
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
              value={query}
              onChange={(event) => applyQuery(event)}
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query.trim()}
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button is-light',
                { 'is-loading': loading },
              )}
              onClick={(event) => findMovie(event)}
            >
              {findedMovie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {findedMovie && (
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

      {findedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={findedMovie} />
        </div>
      )}
    </>
  );
};
