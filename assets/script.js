// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  // DOM element references
  const cells = document.querySelectorAll('.cell');  // Array of all game cells
  const resultBadge = document.querySelector('.result');  // Element to display game result
  const newGameBtn = document.getElementById('newGameBtn');  // Button to start a new game
  const timerBadge = document.querySelector('.timer');  // Timer badge element
  const userBadge = document.querySelector('.badge.bg-info');  // User's turn badge
  const opponentBadge = document.querySelector('.badge.bg-dark');  // Opponent's turn badge

  let timerInterval; // Declare a variable to store the timer interval
  let timerSeconds = 30; // Initial timer value

  // Event listener for starting a new game when the button is clicked
  newGameBtn.addEventListener('click', startNewGame);

  // Function to start a new game
  function startNewGame() {
    resetGame();
    gameActive = true;
    userBadge.classList.remove('d-none');
    opponentBadge.classList.remove('d-none');
    timerBadge.classList.remove('d-none');
    resultBadge.classList.add('d-none');
    updateTurnDisplay();
    // Uncomment the cell borders when the game starts
    cells.forEach(cell => {
      cell.textContent = '';
      cell.style.border = '2px solid #6e6e6e';
    });
  }

  // Function to reset the game state
  function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    resultBadge.textContent = '';
    resultBadge.classList.remove('badge-success', 'badge-danger', 'badge-warning');
    timerBadge.classList.add('d-none');
    currentPlayer = 'X';
    clearInterval(timerInterval); // Clear any existing interval
  }

  // Function to handle a cell click
  function handleCellClick(index) {
    if (board[index] === '' && gameActive && currentPlayer === 'X') {
      board[index] = currentPlayer;
      cells[index].textContent = currentPlayer;

      const winner = checkWinner();
      if (winner) {
        endGame(winner);
      } else {
        currentPlayer = 'O'; // Switch to computer's turn
        resetTimer();
        updateTurnDisplay();
        playComputerTurn();
      }
    }
  }

  // Function to simulate the computer's turn
  function playComputerTurn() {
    setTimeout(() => {
      const emptyCells = board.reduce((acc, val, index) => (val === '' ? [...acc, index] : acc), []);

      if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomIndex] = 'O';
        cells[randomIndex].textContent = 'O';

        const winner = checkWinner();
        if (winner) {
          endGame(winner);
        } else {
          currentPlayer = 'X'; // Switch back to player's turn
          resetTimer();
          updateTurnDisplay();
        }
      }
    }, 1000); // Fixed delay of 1 second for computer's turn
  }

  // Function to end the game and display the result
  function endGame(winner) {
    gameActive = false;
    // Hide timer badge
    timerBadge.classList.add('d-none');
    
    // Display the result on the timer badge's place
    resultBadge.classList.remove('d-none');

    // Remove existing classes from resultBadge
    resultBadge.classList.remove('bg-success', 'bg-danger', 'bg-warning');

    if (winner === 'T') {
        resultBadge.innerHTML = 'It\'s a Tie <i class="fas fa-handshake"></i>';
        resultBadge.classList.add('bg-warning');
    } else if (winner === 'X') {
        resultBadge.innerHTML = 'You Win <i class="fas fa-gift"></i>';
        resultBadge.classList.add('bg-success');
    } else {
        resultBadge.innerHTML = 'You Lost <i class="fas fa-frown"></i>';
        resultBadge.classList.add('bg-danger');
    }
    
    // Add the dark class to user and opponent badges
    userBadge.classList.add('bg-dark');
    opponentBadge.classList.add('bg-dark');
    setTimeout(() => {
      startNewGame();
      resetTimer();
    }, 2000);
  }

  // Function to check for a winner based on the game board
  function checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.includes('') ? null : 'T';
  }

  // Function to update the display for the current turn
  function updateTurnDisplay() {
    userBadge.textContent = 'Your Turn - X';
    opponentBadge.textContent = 'Opponent\'s Turn - O';
    userBadge.classList.toggle('bg-info', currentPlayer === 'X');
    userBadge.classList.toggle('bg-dark', currentPlayer !== 'X');
    opponentBadge.classList.toggle('bg-info', currentPlayer === 'O');
    opponentBadge.classList.toggle('bg-dark', currentPlayer !== 'O');
    timerBadge.classList.remove('d-none');
    startTimer();
  }

  // Function to start the timer
  function startTimer() {
    timerInterval = setInterval(() => {
      timerSeconds--;

      if (timerSeconds < 0) {
        clearInterval(timerInterval);
        endGame(currentPlayer === 'X' ? 'O' : 'X');
      }

      updateTimerDisplay();
    }, 1000);
  }

  // Function to reset the timer
  function resetTimer() {
    clearInterval(timerInterval);
    timerSeconds = 30;
    updateTimerDisplay();
  }

  // Function to update the timer display
  function updateTimerDisplay() {
    const timerSpan = document.getElementById('timerValue');
    timerSpan.textContent = `${timerSeconds}s`;
  }

  // Event listeners for each cell to handle clicks
  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
  });
});