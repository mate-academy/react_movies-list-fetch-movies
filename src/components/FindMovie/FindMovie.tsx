import { FC, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import classNames from 'classnames';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {
  onAddMovie: (movie: Movie) => void;
}

const notFindTitle = "Can't find a movie with such a title";
const imdbHTTPS = 'https://www.imdb.com/title/';
const defaultPoster =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: FC<IProps> = ({ onAddMovie }) => {
  // #region state
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMassage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // #endregion

  const normalizeMovieData = (movieData: MovieData) => {
    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: movieData.Poster !== 'N/A' ? movieData.Poster : defaultPoster,
      imdbUrl: imdbHTTPS + movieData.imdbID,
      imdbId: movieData.imdbID,
    };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }

    setLoading(true);

    getMovie(query)
      .then((result: MovieData | ResponseError) => {
        setTimeout(() => {
          if ('Response' in result && result.Response === 'False') {
            setErrorMessage(notFindTitle);
            setMovie(null);
          } else {
            setMovie(normalizeMovieData(result as MovieData));
          }
        }, 1000);
      })
      .finally(() => {
        setLoading(false);
        setLoaded(true);
      });
  };

  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setErrorMessage('');
  };

  const addMovie = (currentmovie: Movie) => {
    onAddMovie(currentmovie);
    setQuery('');
    setMovie(null);
    setLoaded(false);
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
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': errorMassage })}
              value={query}
              onChange={handleChangeQuery}
            />
          </div>
          {errorMassage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMassage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query || loading}
            >
              {!loaded ? 'Find a movie' : 'Search again'}
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
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
