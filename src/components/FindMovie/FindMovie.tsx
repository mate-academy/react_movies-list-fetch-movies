import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};
export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [movieNotFound, setMovieNotFound] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const buttonDisabled = query.length > 0;

  useEffect(() => {
    if (movieNotFound) {
      setMovieNotFound(false);
    }
  }, [query]);

  const handleFormSubmit = async () => {
    setIsLoad(true);
    const movieData: MovieData | ResponseError = await getMovie(query);

    if ('Title' in movieData) {
      if (movieData.Poster === 'N/A') {
        // eslint-disable-next-line max-len
        movieData.Poster = 'https://via.placeholder.com/360x270.png?text=no%20preview';
      }

      const newMovie: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl: movieData.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      };

      setFoundMovie(newMovie);
    } else {
      setMovieNotFound(true);
    }
  };

  const addMovieToList = () => {
    if (foundMovie) {
      addMovie(foundMovie);
    }

    setFoundMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          handleFormSubmit()
            .finally(() => {
              setIsLoad(false);
            });
        }}
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
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </div>
          {movieNotFound && (
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
              disabled={!buttonDisabled}
              className={cn(
                'button is-light disabled',
                {
                  'is-loading': isLoad,
                },
              )}
            >
              Find a movie
            </button>
          </div>

          {foundMovie
          && (
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
      {foundMovie
      && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
