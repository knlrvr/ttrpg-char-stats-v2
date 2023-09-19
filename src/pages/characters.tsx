import React from 'react'
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

import PageLayout from '@/components/PageLayout';

import { UserCharacterCard } from '@/components/UserCharacterCard';
import { CharacterEditor } from '@/components/CharacterEditor';

const Characters = () => {

  const { data: sessionData } = useSession();

  const { data: charactersData, refetch: refetchCharacters } = api.character.getAllUser.useQuery(
    {
      userId: sessionData?.user.id ?? "",
    },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const createCharacter = api.character.create.useMutation({
    onSuccess: () => {
      void refetchCharacters();
    },
  });

  // to delete character
  const deleteCharacter = api.character.delete.useMutation({
    onSuccess: () => {
      void refetchCharacters();
    },
  });

  return (
    <PageLayout>
      <div className="">
        <p className="text-[#888] uppercase text-xs pb-2">bench</p>
        <div className="pb-4 grid grid-cols-1 gap-4">
          {charactersData?.map((character) => (
            <div key={character.id} className="">
              <UserCharacterCard
                character={character}
                onDelete={() => void deleteCharacter.mutate({ id: character.id })}
              />
            </div>
          ))}
          <div className="flex flex-col">
            <CharacterEditor
              onSave={({ title, stats }) => {
              void createCharacter.mutate({
                title,
                campaignId: null,
                userId: sessionData?.user.id ?? "",
                stats,
                });
              }}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Characters