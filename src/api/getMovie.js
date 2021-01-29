const key = 'apikey=e533ffbf';

export const getMovie = async(query) => {
  const response = await fetch(`http://www.omdbapi.com/?${key}&t=${query}`);
  const result = await response.json();

  return result;
};

// const getMovie = (query) => {
//   fetch(`http://www.omdbapi.com/?apikey=e533ffbf&t=star wars`)
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//     });
// };

// getMovie('6 Underground').then(r => console.log(r));
