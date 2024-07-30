'use client';

import {
  useCallback,
  useEffect,
  useState,
  useReducer,
  MouseEvent,
} from 'react';
import { useRouter } from 'next/navigation';

import Card from '@/app/components/Card';
import CardEditRemote from '@/app/components/CardEditRemote';
import { getCharacterData } from '@/app/api/genshinCharacterDB';
import {
  getUserCharacter,
  updateUserCharacter,
} from '@/app/api/userCharacterDB';
import {
  DBCharacterData,
  LevelAscension,
  UserCharacterData,
} from '@/app/api/types';
import {
  characterDataType2DBType,
  DBCharacterDataType2CharacterDataType,
  getDefaultDBCharacterData,
  getDefaultUserCharacterData,
} from '@/app/api/utils';

type reducerActions = 'setData' | 'setUserCharacterData' | 'setLevelAscension';
function reducer(
  data: {
    characterData: DBCharacterData;
    userData: UserCharacterData;
  },
  action: {
    type: reducerActions;
    characterData?: DBCharacterData;
    userData?: UserCharacterData;
    levelAscension?: LevelAscension;
  },
) {
  switch (action.type) {
    case 'setData': {
      if (!action.characterData) throw new Error('No DB Character Data');
      if (!action.userData) throw new Error('No User Character Data');
      return {
        characterData: action.characterData,
        userData: action.userData,
      };
    }
    case 'setUserCharacterData': {
      if (!action.userData) throw new Error('No User Character Data');
      return {
        ...data,
        userData: action.userData,
      };
    }
    case 'setLevelAscension': {
      if (!action.levelAscension) throw new Error('No LevelAscension');
      return {
        ...data,
        userData: {
          ...data.userData,
          levelAscension: action.levelAscension,
        },
      };
    }
    default:
      return data;
  }
}

export default function Page({ params }: { params: { name: string } }) {
  const router = useRouter();
  const [initData, setInitData] = useState({
    characterData: getDefaultDBCharacterData(),
    userData: getDefaultUserCharacterData(),
  });
  const [data, dispatch] = useReducer(reducer, {
    characterData: getDefaultDBCharacterData(),
    userData: getDefaultUserCharacterData(),
  });

  const updateClickHandle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    updateUserCharacter(characterDataType2DBType(data.userData));
    router.push('/character');
  };

  const loadCharacterData = useCallback(() => {
    Promise.all([
      getCharacterData(params.name),
      getUserCharacter(params.name),
    ]).then((res) => {
      setInitData({
        characterData: res[0],
        userData: DBCharacterDataType2CharacterDataType(res[1]),
      });
      dispatch({
        type: 'setData',
        characterData: res[0],
        userData: DBCharacterDataType2CharacterDataType(res[1]),
      });
    });
  }, [params.name]);

  useEffect(() => {
    loadCharacterData();
  }, [loadCharacterData]);

  return (
    <div className="m-auto flex h-dvh w-full">
      <div className="grow">
        <Card characterData={data.userData} />
      </div>
      <div className="shrink-0 grow-0">
        <CardEditRemote
          initValue={
            initData.userData.name === params.name
              ? initData.userData
              : undefined
          }
          onChange={(v) => {
            dispatch({ type: 'setUserCharacterData', userData: v });
          }}
          onLevelAscensionChange={useCallback((v: LevelAscension) => {
            dispatch({ type: 'setLevelAscension', levelAscension: v });
          }, [])}
        >
          <div className="col-span-2 flex justify-center">
            <button
              type="button"
              onClick={updateClickHandle}
              className="rounded-sm bg-white px-2 py-1"
            >
              변경
            </button>
          </div>
        </CardEditRemote>
      </div>
    </div>
  );
}
