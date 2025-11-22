import React, { useRef, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard/MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Movie | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Преобразует MovieData (от OMDb) в наш локальный Movie
  const normalize = (data: MovieData): Movie => {
    const poster =
      data.Poster && data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview'; // замените путь, если добавите файл в public/images

    return {
      title: data.Title,
      description: data.Plot,
      imgUrl: poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // скрываем сообщение об ошибке и предыдущий превью при редактировании
    if (error) setError(null);
    if (preview) setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = title.trim();
    if (!q) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getMovie(q);

      // тип-guard: если пришел ResponseError (OMDb возвращает { Response: 'False', Error: '...' })
      if ((result as ResponseError).Response === 'False') {
        setError((result as ResponseError).Error || 'Movie not found');
        setPreview(null);
        return;
      }

      // иначе нормализуем и показываем превью
      const movieData = result as MovieData;
      const movie = normalize(movieData);
      setPreview(movie);
    } catch (err) {
      setError('unexpected error');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) return;
    onAdd(preview);
    // очищаем форму и превью
    setTitle('');
    setPreview(null);
    setError(null);
    // вернуть фокус в инпут
    inputRef.current?.focus();
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
              ref={inputRef}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              value={title}
              onChange={handleChange}
            />
          </div>

          {/* сообщение об ошибке — показываем только при наличии */}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={title.trim() === '' || loading}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {/* Кнопка "Add" рендерится только если есть превью (тест ожидает, что элемент не будет в DOM) */}
            {preview && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {/* previewContainer полностью отсутствует, если preview === null (требование тестов) */}
      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
