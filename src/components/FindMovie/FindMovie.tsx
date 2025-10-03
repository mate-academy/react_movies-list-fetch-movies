import React, { useRef, useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import cn from 'classnames';

/* This URL is not valid. I can't open it. */
const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

function normalizeMovie(data: MovieData): Movie {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER,
    imdbId: data.imdbID,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  };
}

type Props = {
  onMovieAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }: Props) => {
  /* I decided to use useRef for better optimization because
  I only need to re-render the component after the form is submitted.
  If I use useState for the query, the component will re-render
  every time the input value changes.

  Moreover, this seems to be the first task where I can properly
  practice using useRef. */
  const inputEl = useRef<HTMLInputElement>(null);
  const submitBtn = useRef<HTMLButtonElement>(null);
  const query = useRef<string>('');

  const [movie, setMovie] = useState<Movie | undefined>();
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onTitleChange = (val: string) => {
    query.current = val;

    if (submitBtn.current) {
      submitBtn.current.disabled = val.trim() === '';

      if (errMsg) {
        setErrMsg('');
      }
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query.current.trim())
      .then(data => {
        if (data && typeof data === 'object' && 'Title' in data) {
          const normalized = normalizeMovie(data as MovieData);

          setMovie(normalized);
          setErrMsg('');
        } else if (data && typeof data === 'object' && 'Error' in data) {
          setErrMsg(data.Error || 'An unexpected error occurred');
          setMovie(undefined);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleMovieAdd = () => {
    if (!movie) {
      return;
    }

    onMovieAdd(movie);

    setMovie(undefined);
    query.current = '';
    if (inputEl.current) {
      inputEl.current.value = '';
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              ref={inputEl}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': errMsg,
              })}
              onChange={event => onTitleChange(event.target.value)}
            />
          </div>

          {errMsg && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled
              ref={submitBtn}
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
                onClick={handleMovieAdd}
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
