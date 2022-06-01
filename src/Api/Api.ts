const MyApiId = '6e81b2fe';

const request = (title: string) => fetch(`https://www.omdbapi.com/?apikey=${MyApiId}&t=${title}`);



export async function prepareMovie(title: string) {
  const response = await request(title);

  return response.json();
}
