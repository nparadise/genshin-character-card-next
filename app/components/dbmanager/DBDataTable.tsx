'use client';

import { DBUserCharacterData } from '@/app/api/types';
import { deleteUserCharacter } from '../../api/userCharacterDB';

function Table({
  data,
  onDataUpdate,
}: {
  data: DBUserCharacterData[];
  onDataUpdate?: () => void;
}) {
  console.log('table', Object.keys(data[0]));

  const getKeys = (): string[] => {
    return Object.keys(data[0]);
  };

  const getEntries = (value: object) => {
    return Object.entries(value);
  };

  const deleteHandle = (value: string) => {
    deleteUserCharacter(value);
    onDataUpdate && onDataUpdate();
  };

  return (
    <table className="w-full text-center">
      <thead>
        <tr>
          {getKeys().map((value) => (
            <th key={`head-${value}`} scope="col" className="bg-blue-800">
              {value}
            </th>
          ))}
          <th scope="col" className="bg-blue-800">
            삭제
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((characterData) => (
          <tr key={characterData.name} className="even:bg-gray-800">
            {getEntries(characterData).map(([key, value], i) => {
              if (key === 'name') {
                return (
                  <th key={`${value}-${key}`} scope="row">
                    {value}
                  </th>
                );
              } else {
                return <td key={`${characterData.name}-${key}`}>{value}</td>;
              }
            })}
            <td>
              <button
                onClick={() => {
                  deleteHandle(characterData.name);
                }}
                type="button"
                className="my-1 bg-gray-300 px-1 text-black"
              >
                삭제
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function DBDataTable({
  data,
  onDataUpdate,
}: {
  data: DBUserCharacterData[];
  onDataUpdate?: () => void;
}) {
  return (
    <>
      {data && data.length === 0 ? (
        <div className="flex size-full items-center justify-center">
          DB empty
        </div>
      ) : (
        <Table data={data} onDataUpdate={onDataUpdate} />
      )}
    </>
  );
}
