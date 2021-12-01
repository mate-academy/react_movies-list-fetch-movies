import { Movie } from '../types/Movie';

const OMDB_KEY = 'ddb8cda1';
const BASE_URL = `http://www.omdbapi.com/?i=tt3896198&apikey=${OMDB_KEY}&`;

const request = async <T>(urlParam: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${urlParam}`);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const getMovie = (title: Movie['Title']) => request<Movie>(`t=${title}`);
