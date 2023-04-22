import React, { useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void;
  moviesList: Movie[]
};

export const FindMovie: React.FC<Props> = ({ addMovie, moviesList }) => {
  const [titleSearchQuery, setSearchField] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSearchFieldChange
  = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setError(false);
    setSearchField(value);
  };

  const createMovie = async (input = titleSearchQuery) => {
    if (isError) {
      setError(false);
    }

    setLoading(true);

    const movieData = await getMovie(input);

    try {
      if ('Title' in movieData) {
        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = movieData;

        const film: Movie = {
          title: Title,
          description: Plot,
          imgUrl: Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovie(film);
      }

      if ('Error' in movieData) {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const addMovieToList = () => {
    if (movie && !(moviesList.find(film => film.imdbId === movie.imdbId))) {
      addMovie(movie);
    }

    setMovie(null);
    setSearchField('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => event.preventDefault()}
      >
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
              value={titleSearchQuery}
              onChange={handleSearchFieldChange}
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
              onClick={() => createMovie()}
              disabled={!titleSearchQuery}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
