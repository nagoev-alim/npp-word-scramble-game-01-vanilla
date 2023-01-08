import words from '../data/mock.js';
import { showNotification } from '../modules/showNotification.js';

/**
 * @class App
 */
export default class App {
  constructor(root) {
    this.root = root;
    this.words = words;
    this.correctWord = null;
    this.timer = null;

    this.root.innerHTML = `
      <h3 class='title'>Word Scramble Game</h3>
      <div class='content'>
        <p class='word h3' data-word=''></p>
        <div class='details'>
          <p class='hint h5'>Hint: <span data-hint=''>A politically identified region</span></p>
          <p class='time h5'>Time Left: <span data-time=''>30s</span></p>
        </div>
        <input type='text' spellcheck='false' placeholder='Enter a valid word' maxlength='7' data-input=''>
        <div class='buttons'>
          <button data-refresh=''>Refresh Word</button>
          <button data-check=''>Check Word</button>
          <button class='hide' data-restart=''>Restart</button>
        </div>
      </div>
    `;

    this.DOM = {
      word: document.querySelector('[data-word]'),
      hint: document.querySelector('[data-hint]'),
      time: document.querySelector('[data-time]'),
      input: document.querySelector('[data-input]'),
      btnRefresh: document.querySelector('[data-refresh]'),
      btnCheck: document.querySelector('[data-check]'),
    };

    this.initGame();

    this.DOM.btnRefresh.addEventListener('click', this.initGame);
    this.DOM.btnCheck.addEventListener('click', this.checkWord);
  }

  /**
   * @function initTimer
   * @param time
   */
  initTimer = (time) => {
    // clearInterval(this.timer);

    this.timer = setInterval(() => {
      if (time > 0) {
        time--;
        return this.DOM.time.innerHTML = `${time}s`;
      }

      showNotification('danger', `Time off! <h3>${this.correctWord.toUpperCase()}</h3> was the correct word`);
      clearInterval(this.timer);
    }, 1000);
  };

  /**
   * @function initGame
   */
  initGame = () => {
    this.initTimer(30);
    const { word, hint } = this.words[Math.floor(Math.random() * this.words.length)];
    console.log({ word });

    let wordArray = word.split('');

    for (let i = wordArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }

    this.DOM.word.innerText = wordArray.join('');
    this.DOM.hint.innerText = hint;
    this.correctWord = word.toLowerCase();
    this.DOM.input.value = '';
    this.DOM.input.setAttribute('maxlength', this.correctWord.length);
  };

  /**
   * @function checkWord - Check if word is correct
   */
  checkWord = () => {
    let word = this.DOM.input.value.toLowerCase();

    if (!word) {
      showNotification('danger', 'Please enter the word to check!');
      return;
    }

    if (word !== this.correctWord) {
      showNotification('warning', `Oops! <h3>${word}</h3> is not a correct word`);
      return;
    }

    showNotification('success', `Congrats! The correct word is: <h3>${this.correctWord.toUpperCase()}</h3>`);
    clearInterval(this.timer);
  };
}
