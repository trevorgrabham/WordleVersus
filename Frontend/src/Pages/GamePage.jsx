import React, { useEffect } from 'react';
import useGameSettingStore from '../stores/gameSettingsStore';
import Error from '../Components/Error';
import UsedLetterGrid from '../Components/UsedLetterGrid';
import GuessInput from '../Components/GuessInput';
import { getWordList, fetchWordle } from '../gameLogic';
import GuessList from '../Components/GuessList';
import useGameDataStore from '../stores/gameDataStore';
import useErrorStore from '../stores/errorStore';

function GamePage() {
  console.log(`Rendering GamePage component`);
  const [gamePageTarget, addError] = useErrorStore((state) => [
    state.gamePageTarget,
    state.addError,
  ]);
  const wordleLength = useGameSettingStore((state) => state.wordleLength);
  const [wordle, setWordle, usedLetters, setWordList, blacklist] =
    useGameDataStore((state) => [
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
      addError({
        message: wordListResponse.message,
        target: 'gamePageTarget',
        component: 'global',
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
      addError({
        message: wordleResponse.message,
        target: 'gamePageTarget',
        component: 'global',
      });
      return;
    }
    setWordle(wordleResponse.data);
  }, [wordleLength]);

  function findError(componentTarget) {
    for (var i = gamePageTarget.length - 1; i >= 0; --i) {
      if (gamePageTarget[i].component === componentTarget)
        return gamePageTarget[i].message;
    }
    return '';
  }

  return (
    <div style={mainContainerStyle}>
      <div style={headerContainerStyle}>
        <div style={wordleContainerStyle}>{wordle}</div>
        <div style={usedLetterContainerStyle}>
          <UsedLetterGrid />
        </div>
      </div>
      {findError('global') && (
        <Error fontSize="12">{findError('global')}</Error>
      )}
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
