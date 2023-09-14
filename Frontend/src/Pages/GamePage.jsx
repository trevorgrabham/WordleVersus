import React, { useState, useEffect } from 'react';
import useGameSettingStore from '../stores/gameSettingsStore';
import Error from '../Components/Error';
import UsedLetterGrid from '../Components/UsedLetterGrid';
import GuessInput from '../Components/GuessInput';
import { getWordList, fetchWordle } from '../gameLogic';
import GuessList from '../Components/GuessList';
import useGameDataStore from '../stores/gameDataStore';

function GamePage() {
  console.log(`Rendering GamePage component`);
  const wordleLength = useGameSettingStore((state) => state.wordleLength);
  const [
    error,
    setError,
    wordle,
    setWordle,
    usedLetters,
    setWordList,
    blacklist,
  ] = useGameDataStore((state) => [
    state.error,
    state.setError,
    state.wordle,
    state.setWordle,
    state.usedLetters,
    state.setWordList,
    state.blacklist,
  ]);

  // TODO: Maybe think about retrying to GET request on error, depedning on the error
  useEffect(async () => {
    if (!wordleLength) return;
    console.log(
      `Attempting to get word list of length ${wordleLength} at /WordLists/${wordleLength}-word-list.json`,
    );
    let wordListResponse = await getWordList(wordleLength);
    if (wordListResponse.error) {
      console.log(`Problem fetching word list of length ${wordleLength}`);
      setError({
        message: wordListResponse.message,
        target: 'global',
      });
      return;
    }
    setWordList(wordListResponse.data);
    console.log(`Fetching a wordle from the word list data`);
    let wordleResponse = fetchWordle({
      data: wordListResponse.data,
      blacklist,
    });
    if (wordleResponse.error) {
      console.log(`Error selecting a wordle from the word list`);
      setError({
        message: wordleResponse.message,
        target: 'global',
      });
      return;
    }
    setWordle(wordleResponse.data);
  }, [wordleLength]);

  return (
    <div style={mainContainerStyle}>
      <div style={headerContainerStyle}>
        <div style={wordleContainerStyle}>{wordle}</div>
        <div style={usedLetterContainerStyle}>
          <UsedLetterGrid />
        </div>
      </div>
      {error.target && <Error>{error.message}</Error>}
      <GuessList />
      <GuessInput />
    </div>
  );
}

export default GamePage;

const mainContainerStyle = {
  width: '100vw',
  height: '100vh',
  padding: '1vmin',
};

const headerContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
};

const wordleContainerStyle = {
  flex: '5',
};

const usedLetterContainerStyle = {
  flex: '1',
};
