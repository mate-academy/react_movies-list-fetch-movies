import { Movie } from '../types';

const apiKey = '37c80b4a';
const baseUrl = `http://www.omdbapi.com/?apikey=${apiKey}&`;

const request = async <T>(urlParam: string): Promise<T> => {
  const response = await fetch(`${baseUrl}${urlParam}`);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const getMovie = (title: Movie['Title']) => request<Movie>(`t=${title}`);
