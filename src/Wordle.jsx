import { useState, useEffect } from 'react';

import './Wordle.css';
import Line from './Line';

import wordList from './assets/word-list.json';

const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

export default function Wordle() {
    const [solution, setSolution] = useState('');
    const [guesses, setGuesses] = useState(Array(6).fill(null));
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [wins, setWins] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const [dictionaryError, setDictionaryError] = useState(false);

    const fetchWord = () => {
        const randomWord =
            wordList[Math.floor(Math.random() * wordList.length)];
        setSolution(randomWord);
    };

    const handleReset = () => {
        setCurrentGuess('');
        setGuesses(Array(6).fill(null));
        fetchWord();
        setGameOver(false);
    };

    useEffect(() => {
        const checkInDictionary = async (word) => {
            try {
                const dictionaryFetch = await fetch(DICTIONARY_API + word);
                return dictionaryFetch.status !== 404;
            } catch {
                setDictionaryError(true);
                return true;
            }
        };

        const handleKey = async (event) => {
            if (gameOver) {
                return;
            }
            if (event.key === 'Enter') {
                if (currentGuess.length != 5) {
                    return;
                }
                if (solution === currentGuess) {
                    setGameOver(true);
                    setWins((oldWins) => oldWins + 1);
                }
                const isInDictionary = await checkInDictionary(currentGuess);
                if (!isInDictionary) {
                    setIsShaking(true);
                    return;
                }

                const newGuess = [...guesses];
                newGuess[newGuess.findIndex((val) => val == null)] =
                    currentGuess;
                setGuesses(newGuess);
                setCurrentGuess('');
                return;
            }
            if (event.key === 'Backspace') {
                setCurrentGuess(currentGuess.slice(0, -1));
                return;
            }
            if (currentGuess.length >= 5) {
                return;
            }

            const isLetter = event.key.match(/^[a-z]$/i) != null;

            if (isLetter) {
                setCurrentGuess(currentGuess + event.key.toUpperCase());
            }
        };

        window.addEventListener('keydown', handleKey);

        return () => window.removeEventListener('keydown', handleKey);
    }, [currentGuess, gameOver, solution, guesses, dictionaryError]);

    useEffect(() => {
        fetchWord();
    }, []);

    return (
        <div className="board">
            {dictionaryError ? (
                <p className="text error">
                    Dictionary connection error, all word will be good
                </p>
            ) : null}
            {guesses.map((guess, i) => {
                const isCurrent = i === guesses.findIndex((val) => val == null);

                return (
                    <Line
                        key={i}
                        guess={isCurrent ? currentGuess : guess ?? ''}
                        solution={solution}
                        isFinal={guesses[i] != null}
                        isShaking={isCurrent ? isShaking : false}
                        setIsShaking={setIsShaking}
                    />
                );
            })}
            <p className="text">Win in a row: {wins}</p>
            {gameOver || guesses.findIndex((val) => val == null) === -1 ? (
                <>
                    <p className="text">Correct answer: {solution}</p>
                    <button
                        type="reset"
                        className="resetBtn"
                        onClick={handleReset}
                    >
                        Play Again
                    </button>
                </>
            ) : null}
        </div>
    );
}
