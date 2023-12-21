import cn from 'classnames';
import React, { useState } from 'react';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
// import { MovieData } from '../../types/MovieData';
// import { ResponseError } from '../../types/ReponseError';
type Props = {
  giveMovie: (movie: Movie) => void
};

const FIND_BUTTON = 'Find';
const SEARCH_AGAIN_BUTTON = 'Search again';

export const FindMovie: React.FC<Props> = ({ giveMovie }) => {
  const [text, setText] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasMovie, setHasMovie] = useState(false);
  const [buttonText, setButtonText] = useState(FIND_BUTTON);

  const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    setHasError(false);
  };

  const handleFindButton = () => {
    setIsLoading(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    getMovie(text.toLowerCase())
      .then(data => {
        if (data.Response === 'False') {
          setHasError(true);
        } else {
          setHasError(false);
          setHasMovie(true);
          setButtonText(SEARCH_AGAIN_BUTTON);

          const newMovie: Movie = {
            title: data.Title,
            description: data.Plot,
            imdbId: data.imdbID,
            imgUrl: data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
            imdbUrl: '',
          };

          setMovie(newMovie);
        }
      })

      .catch((e) => {
        throw new Error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddFilm = () => {
    if (!movie) {
      return;
    }

    giveMovie(movie);
    setHasMovie(false);
    setText('');
    setButtonText(FIND_BUTTON);
    setHasError(false);
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
              value={text}
              onChange={handleText}
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': hasError,
              })}
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
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!text}
              onClick={handleFindButton}
            >
              {buttonText}
            </button>
          </div>

          {hasMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddFilm}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      {hasMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
