import React, { useEffect } from 'react';
import useGameSettingStore from '../stores/gameSettingsStore';
import Error from '../Components/Error';
import Header from '../Components/Header';
import UsedLetterGrid from '../Components/UsedLetterGrid';
import GuessInput from '../Components/GuessInput';
import { getWordList, fetchWordle } from '../gameLogic';
import GuessList from '../Components/GuessList';
import useGameDataStore from '../stores/gameDataStore';
import useErrorStore from '../stores/errorStore';
import socket from '../socket';

function GamePage() {
  console.log(`Rendering GamePage component`);
  const [gamePageTarget, addError, getErrorMessage] = useErrorStore((state) => [
    state.gamePageTarget,
    state.addError,
    state.getErrorMessage,
  ]);
  const [wordleLength, roomCode] = useGameSettingStore((state) => [
    state.wordleLength,
    state.roomCode,
  ]);
  const [wordle, setWordle, setWordList, blacklist] = useGameDataStore(
    (state) => [
      state.wordle,
      state.setWordle,
      state.setWordList,
      state.blacklist,
    ],
  );

  // TODO: Maybe think about retrying to GET request on error, depedning on the error
  // TODO: socket.emit('leaveRoom') when the component unmounts
  // TODO: set up the socket.on events for connecting, and recieving guesses from the other player
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

  useEffect(() => {
    socket.on('connection', () => {
      console.log('Connected to the web socket');
    });

    // TODO: fill this out with logic for when the other player guesses
    socket.on('guessReceived', (data) => {});

    return () => {
      socket.off('guessReceived');
      socket.emit('leaveRoom', { roomCode });
    };
  });

  return (
    <div style={mainContainerStyle}>
      <Header />
      <div style={headerContainerStyle}>
        <div style={wordleContainerStyle}>{wordle}</div>
        <div style={usedLetterContainerStyle}>
          <UsedLetterGrid />
        </div>
      </div>
      {getErrorMessage({ target: 'gamePageTarget', component: 'global' }) && (
        <Error fontSize="12">
          {getErrorMessage({ target: 'gamePageTarget', component: 'global' })}
        </Error>
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
