import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | ResponseError | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const showPreview = movie && !('Response' in movie);

  const defaultPoster =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const hasMovieData = (data: ResponseError | MovieData): data is MovieData =>
    'Poster' in data && 'Title' in data && 'Plot' in data && 'imdbID' in data;

  const normalizeMovieData = (data: MovieData): Movie => ({
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster === 'N/A' ? defaultPoster : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
  };

  const handleAddMovie = () => {
    if (showPreview) {
      addMovie(movie);
    }

    setMovie(null);
    setTitle('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(false);
    setMovie(null);

    getMovie(title)
      .then((data) => {
        if ('Response' in data && data.Response === 'False') {
          setError(true);
          setMovie(null);
        } else if (hasMovieData(data)) {
          setMovie(normalizeMovieData(data));
        }
      })
      .catch(() => {
        setMovie(null);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
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
              className={classNames({
                input: true,
                'is-danger': error,
              })}
              value={title}
              onChange={handleTitleChange}
            />
          </div>
          {error && (
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
              disabled={!title.trim().length}
              className={classNames({
                'button is-light': true,
                'is-loading': loading,
              })}
            >
              {showPreview ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {showPreview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {showPreview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
