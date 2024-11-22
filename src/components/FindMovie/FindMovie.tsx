// #region imports
import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
// #endregion

type Props = {
  onAdd?: (movie: Movie) => void;
};

// використовується функція через пропси в Аппці потрібна функція додавання фільмів у список
export const FindMovie: React.FC<Props> = ({ onAdd = () => {} }) => {
  // для інпута
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Movie | null>(null);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // проміс, обробляє результат getMovie(який повертає нам об'єкт JSON)
  const handleSearch = async (e: React.FormEvent) => {
    // щоб форма не скидалась
    e.preventDefault();
    // початок завантаження
    setIsLoading(true);

    await getMovie(query)
      .then(response => {
        // відповідь може бути в двох форматах - або об'єкт з фільмом (MovieData) або об'єкт ResponseError
        // тут зараз перевіряється чи у відповіді є властивість Error, отже була помилка при відправці даних
        if ('Error' in response) {
          setHasSearchError(true);
          // треба зробити помилку і більше нічого не робити

          return;
        }

        // оригінальна відповідь сервера у нас у форматі MovieData(об'єкт з купою властивостей, але нам треба лише декілька)
        const { Poster, Title, Plot, imdbID } = response;

        // переводим MovieData у звичний нам формат Movie, який використовується в MovieCard
        setSearchResult({
          title: Title,
          description: Plot,
          imgUrl:
            // якщо на місці постера не було посилання, то використовуєм дефолтну картинку
            Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
          imdbId: imdbID,
          // посилання на ІМДБ в MovieData не було, отже треба його склепати самому
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        });
      })
      // в будь якому випадку завантаження закінчуєм
      .finally(() => setIsLoading(false));
  };

  // кожен раз при оновленні інпута скидаєм помилку
  useEffect(() => {
    setHasSearchError(false);
  }, [query]);

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
              className={cn('input', {
                'is-danger': hasSearchError,
              })}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {hasSearchError && (
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
                // тут кружок загрузки відображався на кнопці за доп. спец класу
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {searchResult && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  // по відправці в список викликається додавання фільму
                  onAdd(searchResult);
                  // скидається результат пошуку
                  setSearchResult(null);
                  // очищається поле
                  setQuery('');
                  // скидаються всі помилки
                  setHasSearchError(false);
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {/* контейнер з прев'юшкою відображається лише якщо пошук дав якись результат */}
      {searchResult && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={searchResult} />
        </div>
      )}
    </>
  );
};
