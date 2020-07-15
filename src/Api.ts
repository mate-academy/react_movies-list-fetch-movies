export const fetchData = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  const data = response.json();

  return data;
};
