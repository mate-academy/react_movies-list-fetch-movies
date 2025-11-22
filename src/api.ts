import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'http://www.omdbapi.com/?apikey=7e60abfe';

/**
 * Выполняет запрос к OMDb по названию фильма.
 * Возвращает либо MovieData (успех), либо ResponseError (ошибка от OMDb / сетевой catch).
 */
export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const trimmed = query.trim();
  const url = `${API_URL}&t=${encodeURIComponent(trimmed)}`;

  return fetch(url)
    .then(async (res) => {
      // parse JSON и вернуть как есть — тесты/компоненты будут разбирать поля
      const json = await res.json();
      return json as MovieData | ResponseError;
    })
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
