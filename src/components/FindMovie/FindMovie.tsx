import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  setMovies: (movies: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoaded(true);
    try {
      const data = await getMovie(query);

      if ('Error' in data) {
        setIsError(true);
      } else {
        const {
          Poster, Title, Plot, imdbID,
        } = data;
        const defaultPicture
          = 'https://via.placeholder.com/360x270.png?text=no%20preview';

        const imgUrl = (Poster !== 'N/A') ? Poster : defaultPicture;
        const imdbUrl = `https://www.imdb.com/title/${imdbID}`;
        const newMovie = {
          title: Title,
          description: Plot,
          imgUrl,
          imdbUrl,
          imdbId: imdbID,
        };

        setMovie(newMovie);
      }
    } catch (error) {
      throw new Error(`Unexpected error${error}`);
    } finally {
      setIsLoaded(false);
    }
  };

  const clearForm = () => {
    setQuery('');
    setMovie(null);
  };

  const updateList = () => {
    const isNotACopy = movies
      .every(film => film.imdbId !== movie?.imdbId);

    if (movie && isNotACopy) {
      setMovies([
        ...movies,
        movie,
      ]);
    }

    clearForm();
  };

  const handleQuery = (value: React.SetStateAction<string>) => {
    setQuery(value);
    setIsError(false);
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
              className="input is-dander"
              value={query}
              onChange={(event) => handleQuery(event.target.value)}
            />
          </div>

          {isError
            && (
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
                { 'is-loading': isLoaded },
              )}
              disabled={!query}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={updateList}
                >
                  Add to the list
                </button>
              </div>
            )}
        </div>
      </form>

      {movie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )}
    </>
  );
};
