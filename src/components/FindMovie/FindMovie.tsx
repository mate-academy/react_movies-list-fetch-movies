import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [foundMovieError, setFoundMovieError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToList = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!movie) {
      return;
    }

    event.preventDefault();
    addMovie(movie);
    setMovie(null);
    setQuery('');
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      setFoundMovieError('Put the movie name');

      return;
    }

    setIsLoading(true);
    const response = await getMovie(query);

    setIsLoading(false);
    if ('Error' in response) {
      setFoundMovieError('Can\'t find a movie with such a title');

      return;
    }

    const {
      Title,
      Plot,
      imdbID,
      Poster,
    } = response;
    const imgUrl = Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : Poster;

    const newMovie = {
      title: Title,
      description: Plot,
      imgUrl,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };

    if (newMovie.imgUrl === 'N/A') {
      // eslint-disable-next-line max-len
      newMovie.imgUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';
    }

    setMovie(newMovie);
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
              onChange={(event) => {
                setQuery(event.target.value);
                setFoundMovieError(null);
              }}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {foundMovieError}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={handleSubmit}
              disabled={!query}
            >
              {!movie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToList}
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
