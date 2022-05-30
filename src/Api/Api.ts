const MyApiId = '6e81b2fe';

const request = (title: string) => fetch(`https://www.omdbapi.com/?apikey=${MyApiId}&t=${title}`);



export async function prepareMovie(title: string) {

  const responseCall = async () =>
    await request(title)
    .then(response => {
      if (!response.ok) {
        Promise.reject();
      }

      return response.json()
    });

  const preparedMovie: Movie = await responseCall();

  return preparedMovie;
}
