const API_URL = 'https://www.omdbapi.com/?apikey=b8a05f94';

export interface ResponseError {
  Response: 'False';
  Error: string;
}

export interface MovieData {
  Poster: string;
  Title: string;
  Plot: string;
  imdbID: string;
}

export async function getMovie(
  query: string,
): Promise<MovieData | ResponseError> {
  try {
    const response = await fetch(`${API_URL}&t=${encodeURIComponent(query)}`);
    const data = await response.json();

    return data;
  } catch (error) {
    return {
      Response: 'False',
      Error: error instanceof Error ? error.message : String(error),
    };
  }
}
