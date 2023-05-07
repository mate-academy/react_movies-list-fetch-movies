import { getMovie } from '../services/api';
import { normalizeData } from '../services/normalizeData';
import { Movie } from '../types/Movie';

export function useFetch() {
  const fetchMovie = async (
    query: string,
    setMovie: React.Dispatch<React.SetStateAction<Movie | null>>,
    setIsError: React.Dispatch<React.SetStateAction<boolean>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (!query.trim()) {
      setIsError(true);

      return;
    }

    setIsLoading(true);
    try {
      const response = await getMovie(query.trim());

      if ('Error' in response) {
        throw new Error(response.Error);
      }

      setMovie(normalizeData(response));
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return fetchMovie;
}
