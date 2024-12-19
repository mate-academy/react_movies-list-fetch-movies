import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type FindMovieProps = {
  onAddMovie: (movie: Movie) => void;
};

const DEFAULT_POSTER_LINK =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<FindMovieProps> = ({ onAddMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getMovieFromServer = (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchQuery.length) {
      return;
    }

    setMovie(null);
    setIsLoading(true);
    setErrorMessage('');

    getMovie(searchQuery)
      .then(result => {
        if ('Error' in result) {
          setErrorMessage("Can't find a movie with such a title");
        } else {
          const movieData = result as MovieData;
          const defaultPicture =
            movieData.Poster !== 'N/A' ? movieData.Poster : DEFAULT_POSTER_LINK;

          setMovie({
            description: movieData.Plot,
            imdbId: movieData.imdbID,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imgUrl: defaultPicture,
            title: movieData.Title,
          });
        }
      })
      .catch(() => {
        setErrorMessage('Something went wrong. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);
      setMovie(null);
      setSearchQuery('');
    }
  };

  const handleSearchMovie = (event: React.ChangeEvent<HTMLInputElement>) => {
    const requestText = event.target.value;

    setSearchQuery(requestText);
    setErrorMessage('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={getMovieFromServer}>
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
              className={`input ${errorMessage ? 'is-danger' : ''}`}
              value={searchQuery}
              onChange={handleSearchMovie}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={searchQuery.length === 0 ? true : false}
            >
              Find a movie
            </button>
          </div>
          {movie && (
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
