const DB_NAME: string = 'character';
const DB_VERSION: number = 2;
const OBJECT_STORES = {
  character: [
    'level',
    'ascension',
    'atk',
    'def',
    'critRate',
    'critDmg',
    'elem',
    'energy',
    'dmgBonus',
    'hp',
  ] as const,
  basicData: ['title', 'element'] as const,
};

export { DB_NAME, DB_VERSION, OBJECT_STORES };
