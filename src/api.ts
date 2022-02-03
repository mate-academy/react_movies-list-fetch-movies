// const url = 'https://www.omdbapi.com/?apikey=ebc435ec&t=dark';

export async function getMovie() {
  const test = await fetch('https://www.omdbapi.com/?apikey=ebc435ec&t=dark');
  const result = await test.json();

  // eslint-disable-next-line no-console
  console.log(result);
}
