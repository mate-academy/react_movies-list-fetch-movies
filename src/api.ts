// eslint-disable-next-line

export const request = (value: string) => {
  const data = fetch(`https://www.omdbapi.com/?apikey=f7122209&${value}`)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });

  return data;
};
