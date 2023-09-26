/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
// import { MovieData } from '../../types/MovieData';
// import { ResponseError } from '../../types/ReponseError';

type EventSubmitType
  = React.MouseEvent<HTMLButtonElement, MouseEvent>
  | React.FormEvent<HTMLFormElement>;

interface Props {
  movies: Movie[],
  addMovie: (movie: Movie) => void;
}

const defaultImageUrl = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({
  movies,
  addMovie = () => {},
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [inputTitle, setInputTitle] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const generateImgUrl = (imgUrl: string) => {
    return imgUrl === 'N/A' ? defaultImageUrl : imgUrl;
  };

  const updateMovie = (response: MovieData | ResponseError) => {
    if ('Error' in response) {
      setError(true);

      return;
    }

    const newMovie = {
      title: response.Title,
      description: response.Plot,
      imgUrl: generateImgUrl(response.Poster),
      imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
      imdbId: response.imdbID.toString(),
    };

    setMovie(newMovie);
  };

  useEffect(() => {
    if (query) {
      setLoading(true);

      getMovie(query)
        .then(response => updateMovie(response))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  const handleSubmit = (event: EventSubmitType) => {
    event.preventDefault();

    setQuery(inputTitle);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(event.target.value);
    setError(false);
  };

  const reset = () => {
    setInputTitle('');
    setMovie(null);
    setQuery('');
  };

  const handleAddMovieClick = () => {
    if (movie) {
      const hasMovie = movies.findIndex(currentMovie => currentMovie.imdbId === movie.imdbId);

      if (hasMovie === -1) {
        addMovie(movie);
      }

      reset();
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className="input is-danger"
              value={inputTitle}
              onChange={handleChange}
            />
          </div>

          {
            error && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              onClick={handleSubmit}
              disabled={!inputTitle}
            >
              Find a movie
            </button>
          </div>
          {
            movie && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handleAddMovieClick}
                >
                  Add to the list
                </button>
              </div>
            )
          }
        </div>
        {
          movie && (
            <div className="container" data-cy="previewContainer">
              <h2 className="title">Preview</h2>
              <MovieCard movie={movie} />
            </div>
          )
        }
      </form>
    </>
  );
};
