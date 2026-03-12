import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError'; // исправил опечатку в названии файла (ReponseError → ResponseError)

const API_KEY = 'd28f3f32'; // ← твой ключ (лучше вынести в .env)

const BASE_URL = 'https://www.omdbapi.com/';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  // теперь функция принимает только один аргумент — query
  // ключ хранится внутри файла (или можно вынести в .env)

  const url = `${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(query)}`;

  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      // если сервер вернул ошибку в JSON
      if ('Response' in data && data.Response === 'False') {
        return {
          Response: 'False',
          Error: data.Error || 'Movie not found',
        } as ResponseError;
      }
      return data as MovieData;
    })
    .catch(error => {
      console.error('API request failed:', error);
      return {
        Response: 'False',
        Error: 'unexpected error',
      } as ResponseError;
    });
}