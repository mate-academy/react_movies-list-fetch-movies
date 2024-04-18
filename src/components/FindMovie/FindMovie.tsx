import React, { useMemo, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

const DEAFULT_PICTURE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

type MovieTypes = MovieData | ResponseError | null;

type Props = {
  addMovie: (prop: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movieData, setMovieData] = useState<MovieTypes>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const isError = useMemo(() => {
    return movieData && movieData.Response === 'False';
  }, [movieData]);

  const currentMovie = useMemo(() => {
    if (!movieData || movieData.Response === 'False') {
      return null;
    }

    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: movieData.Poster === 'N/A' ? DEAFULT_PICTURE : movieData.Poster,
      imdbId: movieData.imdbID,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    };
  }, [movieData]);

  const findMovieHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const query = title.toLowerCase().trim();

    setIsLoading(true);

    getMovie(query).then(result => {
      setIsLoading(false);
      setMovieData(result);
    });
  };

  const addMovieHandler = () => {
    if (currentMovie) {
      addMovie(currentMovie);
      setTitle('');
      setMovieData(null);
    }
  };

  return (
    <>
      <form onSubmit={findMovieHandler} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setMovieData(null);
              }}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': isError })}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title.trim() ? true : false}
            >
              Find a movie
            </button>
          </div>

          {currentMovie && (
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

      {currentMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
