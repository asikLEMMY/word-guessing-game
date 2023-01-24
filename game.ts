import axios from "axios";
import electron from "electron"


class WordGuess {
    private word: string;
    private guessedLetters: Set<string>;
    private incorrectGuesses: number;
    private maxIncorrectGuesses: number;

    constructor(word: string, maxIncorrectGuesses: number) {
        this.word = word;
        this.guessedLetters = new Set<string>();
        this.incorrectGuesses = 0;
        this.maxIncorrectGuesses = maxIncorrectGuesses;
    }

    public guess(letter: string): boolean {
        letter = letter.toLowerCase();
        if (this.guessedLetters.has(letter)) {
           alert(`You already guessed ${letter}`);
            return false;
        }
        this.guessedLetters.add(letter);
        if (this.word.includes(letter)) {
           alert(`Correct! "${letter}" is in the word.`);
            return true;
        } else {
           alert(`Incorrect! "${letter}" is not in the word.`);
            this.incorrectGuesses++;
            return false;
        }
    }

    public getWord(): string {
        let wordToShow = '';
        for (const letter of this.word) {
            if (this.guessedLetters.has(letter)) {
                wordToShow += letter;
            } else {
                wordToShow += '_';
            }
        }
        return wordToShow;
    }

    public getIncorrectGuesses(): number {
        return this.incorrectGuesses;
    }

    public getMaxIncorrectGuesses(): number {
        return this.maxIncorrectGuesses;
    }

    public isWon(): boolean {
        return !this.getWord().includes('_');
    }

    public isLost(): boolean {
        return this.incorrectGuesses >= this.maxIncorrectGuesses;
    }
}

async function getRandomWord() {
    try {
        const response = await axios.get("https://random-word-api.herokuapp.com/word?number=1");
        return response.data[0];
    } catch (error) {
       alert(error);
    }
}

const word = await getRandomWord();
const maxIncorrectGuesses = 6;
const game = new WordGuess(word, maxIncorrectGuesses);

const guessInput = document.getElementById("guessInput") as HTMLInputElement;
const guessButton = document.getElementById("guessButton") as HTMLButtonElement;

while (!game.isWon() && !game.isLost()) {
   alert(`Word: ${game.getWord()}`);
   alert(`Incorrect guesses: ${game.getIncorrectGuesses()}/${game.getMaxIncorrectGuesses()}`);
    const guess = guessInput.value;
    game.guess(guess);
}

if (game.isWon()) {
   alert(`Congratulations! You guessed the word "${word}" correctly!`);
} else {
   alert(`Sorry, you lost! The word was "${word}".`);
}
