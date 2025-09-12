import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  onMovieAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [movieData, setMovieData] = useState<MovieData | ResponseError>();
  const [isCanNotFind, setIsCanNotFind] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | undefined>();

  const defaultImg =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    getMovie(query.trim())
      .then(setMovieData)
      .catch(() => {
        setMovieData({ Error: 'Something went wrong' } as ResponseError);
      })
      .finally(() => setLoading(false));
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsCanNotFind(false);
  };

  const handleMovieAdd = () => {
    if (movie) {
      onMovieAdd(movie);
    }

    setQuery('');
    setMovie(undefined);
  };

  useEffect(() => {
    if (movieData && 'Error' in movieData) {
      setMovieData(undefined);
      setIsCanNotFind(true);
    }

    if (movieData && 'Title' in movieData) {
      setMovie({
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl: movieData.Poster !== 'N/A' ? movieData.Poster : defaultImg,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      });
    }
  }, [movieData]);

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
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
              className={classNames('input', { 'is-danger': isCanNotFind })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {isCanNotFind && (
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
                'is-loading': loading,
              })}
              disabled={query.length === 0}
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
