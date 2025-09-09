import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  // 1. Створення станів для назви фільму та даних про фільм
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 2. Обробник надсилання форми
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Запобігаємо перезавантаженню сторінки

    if (!title.trim()) {
      setErrorMessage('Please enter a movie title.');

      return;
    }

    // 3. Скидаємо попередні помилки та встановлюємо стан завантаження
    setErrorMessage('');
    setIsLoading(true);

    // 4. Викликаємо функцію getMovie та обробляємо Promise
    getMovie(title)
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setErrorMessage(data.Error);
          setMovie(null);
        } else {
          const transformedMovie = {
            title: data.Title,
            description: data.Plot,
            imgUrl:
              data.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : data.Poster,
            imdbUrl: `https://imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setMovie(transformedMovie);
          setErrorMessage('');
        }
      })
      .catch(() => {
        setErrorMessage('An unexpected error occurred.');
        setMovie(null);
      })
      .finally(() => {
        setIsLoading(false);
        setErrorMessage('');
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
              className={`input ${errorMessage ? 'is-danger' : ''}`}
              value={title} // Прив'язка значення до стану
              onChange={e => {
                setTitle(e.target.value);
                if (errorMessage) {
                  setErrorMessage('');
                }
              }}
              // Оновлення стану при зміні
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className="button is-light"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  onAddMovie(movie);
                  setMovie(null);
                  setTitle('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {isLoading && <p>Loading...</p>}
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
