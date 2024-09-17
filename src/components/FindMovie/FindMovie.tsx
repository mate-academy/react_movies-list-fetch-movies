import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames'; // Импортируем библиотеку classnames

interface FindMovieProps {
  addMovieToList: (movie: any) => void; // Функция для добавления фильма в список
}

export const FindMovie: React.FC<FindMovieProps> = ({ addMovieToList }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTriggered, setSearchTriggered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query) return;

    setSearchTriggered(true);
    setLoading(true); // Устанавливаем состояние загрузки в true

    try {
      console.log('Searching for:', query);
      const findedMovie = await getMovie(query);

      console.log('Received movie data:', findedMovie);

      if (findedMovie.Response === 'False') {
        setError(findedMovie.Error);
        setMovie(null);
      } else {
        // Добавляем логику для установки URL постера по умолчанию
        const movieWithDefaultPoster = {
          ...findedMovie,
          Poster:
            findedMovie.Poster !== 'N/A'
              ? findedMovie.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        };

        setMovie(movieWithDefaultPoster);
        setError(null);
      }
    } catch {
      setError('An unexpected error occurred');
      setMovie(null);
    } finally {
      setLoading(false); // Устанавливаем состояние загрузки в false после завершения запроса
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(null); // Сбрасываем ошибку при изменении запроса
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              onChange={handleQueryChange}
              value={query}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={query.length === 0}
            >
              {movie ? 'Search again' : 'Find movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovieToList(movie);
                  setQuery('');
                  setMovie(null);
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
