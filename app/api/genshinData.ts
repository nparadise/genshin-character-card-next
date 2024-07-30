const BASE_URL = 'https://genshin-db-api.vercel.app/api/v5';
const NOT_APPEARED = ['aether', 'lumine', 'emilie'];

export async function getAllCharacterNameList() {
  const res = await fetch(
    `${BASE_URL}/characters?query=name&matchCategories=true`,
  );
  if (!res.ok) throw new Error('Failed to fetch data');

  const data: string[] = await res.json();
  data.forEach((item, index) => {
    if (NOT_APPEARED.includes(item.toLowerCase())) {
      data.splice(index, 1);
    }
  });

  return data;
}

export async function getAllCharacterDataList() {
  const res = await fetch(
    `${BASE_URL}/characters?query=name&matchCategories=true&verboseCategories=true`,
  );
  if (!res.ok) throw new Error('Failed to fetch data');

  const data: {}[] = await res.json();
  data.forEach((item, index) => {
    if (
      'name' in item &&
      NOT_APPEARED.includes((item.name as string).toLowerCase())
    ) {
      data.splice(index, 1);
    }
  });

  return data;
}

export async function getCharacterData(name: string) {
  const res = await fetch(`${BASE_URL}/characters?query=${name}`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
