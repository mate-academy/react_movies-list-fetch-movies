import React, { useRef, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

const DEFAULT_STATE = {
  input: '',
  movieValue: null,
  movieNotFound: false,
  movieLoading: false,
  firstSearch: true,
};

type Props = {
  onAddNewMovie: (movie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddNewMovie }) => {
  const [inputValue, setInputValue] = useState<string>(DEFAULT_STATE.input);
  const [movie, setMovie] = useState<Movie | null>(DEFAULT_STATE.movieValue);
  const prevSearch = useRef<string>();
  const [movieNotFound, setMovieNotFound] = useState<boolean>(
    DEFAULT_STATE.movieNotFound,
  );
  const [movieLoading, setMovieLoading] = useState<boolean>(
    DEFAULT_STATE.movieLoading,
  );
  const [firstSearch, setFirstSearch] = useState(DEFAULT_STATE.firstSearch);

  const handleMovieSearch = () => {
    const titleValue = inputValue.trim().toLowerCase();

    if (titleValue === prevSearch.current) {
      return;
    }

    prevSearch.current = titleValue;

    setMovieLoading(true);

    getMovie(titleValue)
      .then(data => {
        if ('Error' in data) {
          if (!movieNotFound) {
            setMovieNotFound(true);
          }

          return;
        }

        const movieImdbUrl = `https://www.imdb.com/title/${data.imdbID}`;
        const posterInfo = data.Poster;

        const poster =
          posterInfo === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : posterInfo;

        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl: poster,
          imdbUrl: movieImdbUrl,
          imdbId: data.imdbID,
        });

        if (firstSearch) {
          setFirstSearch(!firstSearch);
        }
      })
      .finally(() => setMovieLoading(false));
  };

  const handleMovieSubmit = () => {
    onAddNewMovie(movie);
    setInputValue(DEFAULT_STATE.input);
    setMovie(DEFAULT_STATE.movieValue);
    setMovieLoading(DEFAULT_STATE.movieLoading);
    setMovieNotFound(DEFAULT_STATE.movieNotFound);
    setFirstSearch(DEFAULT_STATE.firstSearch);
    prevSearch.current = '';
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
              className={cn('input', { 'is-danger': movieNotFound })}
              value={inputValue}
              onChange={event => {
                if (movieNotFound) {
                  setMovieNotFound(false);
                }

                setInputValue(event.target.value);
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
              className={cn('button', 'is-light', {
                'is-loading': movieLoading,
              })}
              onClick={event => {
                event.preventDefault();
                handleMovieSearch();
              }}
              disabled={inputValue === ''}
            >
              {firstSearch ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleMovieSubmit}
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
          <MovieCard movie={movie as Movie} />
        </div>
      )}
    </>
  );
};
