import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

const createNewMovie = (movieData: MovieData): Movie => {
  // eslint-disable-next-line max-len
  const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const newMovie: Movie = {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster === 'N/A'
      ? defaultPicture
      : movieData.Poster,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    imdbId: movieData.imdbID,
  };

  return newMovie;
};

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const loadMovie = async () => {
    try {
      setIsloading(true);
      const result = await getMovie(query);

      if ('Error' in result) {
        setIsError(true);
      } else {
        const newMovie = createNewMovie(result);

        setMovie(newMovie);
      }
    } finally {
      setIsloading(false);
    }
  };

  const handleInput = (input: string) => {
    setIsError(false);
    setQuery(input);
  };

  const handleAddingMovie = (newMovie: Movie) => {
    addMovie(newMovie);
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => e.preventDefault()}
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
              value={query}
              onChange={(e) => handleInput(e.target.value)}
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
              className={classnames({
                'button is-light': true,
                'is-loading': isLoading,
              })}
              disabled={!query}
              onClick={loadMovie}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddingMovie(movie)}
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
