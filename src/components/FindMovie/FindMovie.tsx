import React, { useEffect, useRef, useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { API_IMDB_URL, getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { isMovieData } from '../../guards/IsMovieData';
import ShouldShow from '../Wrappers/ShouldShow';

interface Props {
  onMovieAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [movie, setMovie] = useState<Movie>();
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const findFocusRef = useRef<HTMLInputElement>(null);

  const handleMovieData = ({ Poster, Title, Plot, imdbID }: MovieData) => {
    const placeholderUrl =
      'https://via.placeholder.com/360x270.png?text=no%20preview';

    setMovie({
      title: Title,
      description: Plot,
      imgUrl: Poster === 'N/A' || !Poster ? placeholderUrl : Poster,
      imdbId: imdbID,
      imdbUrl: `${API_IMDB_URL}${imdbID}`,
    });
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    onMovieAdd(movie);
    setMovie(undefined);
    setTitle('');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    getMovie(title)
      .then(movieData => {
        if (isMovieData(movieData)) {
          handleMovieData(movieData);
        } else {
          throw new Error("Couldn't parse movie data");
        }
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    findFocusRef.current?.focus();
  }, []);

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
              ref={findFocusRef}
              placeholder="Enter a title to search"
              value={title}
              onChange={handleTitleChange}
              className={classNames('input ', {
                'is-danger': hasError,
              })}
            />
          </div>

          <ShouldShow showCondition={hasError}>
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          </ShouldShow>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={Boolean(!title.length)}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            <ShouldShow showCondition={Boolean(movie)}>
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </ShouldShow>
          </div>
        </div>
      </form>

      <ShouldShow showCondition={Boolean(movie)}>
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie!} />
        </div>
      </ShouldShow>
    </>
  );
};
