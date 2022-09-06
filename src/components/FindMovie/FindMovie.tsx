import { useState } from 'react';
import classNames from 'classnames';

import { getMovie } from '../../api';

import { Movie } from '../../types/Movie';

import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  onMovieAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, onMovieAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isSearched, setIsSearched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleSearch = () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    getMovie(title)
      .then(data => {
        if ('Error' in data) {
          setMovie(null);
        } else {
          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          });
        }
      })
      .finally(() => {
        setIsFetching(false);
        setIsSearched(true);
      });
  };

  const handleAdd = () => {
    if (!movie) {
      return;
    }

    const hasMovie = movies.find(
      addedMovie => addedMovie.title === movie.title,
    );

    if (!hasMovie) {
      onMovieAdd(movie);
    }

    setTitle('');
    setIsSearched(false);
    setMovie(null);
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
              className={
                classNames(
                  'input',
                  {
                    'is-danger': isSearched && !movie,
                  },
                )
              }
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setIsSearched(false);
              }}
            />
          </div>

          {isSearched && !movie && (
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
                'button is-light',
                {
                  'is-loading': isFetching,
                },
              )}
              disabled={!title || (isSearched && !movie)}
              onClick={(event) => {
                event.preventDefault();

                if (!title) {
                  return;
                }

                handleSearch();
              }}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={(event) => {
                  event.preventDefault();

                  handleAdd();
                }}
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
