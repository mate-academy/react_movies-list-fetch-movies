const URL = 'https://www.omdbapi.com/?apikey=80a4e995&t=';

export async function getMovieByTitle(title: string): Promise<Movie | null> {
  const movie = await fetch(`${URL}${title}`);

  if (movie.ok
    && movie.headers
      .get('content-type')
      ?.includes('application/json')
  ) {
    return movie.json();
  }

  return null;
}

// eslint-disable-next-line no-console
console.log(getMovieByTitle('ass'));
