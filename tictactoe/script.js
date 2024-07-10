
const { createApp } = Vue

createApp({
  data() {
    return {
      board: Array(9).fill(''),
      currentPlayer: 'X',
      gameOver: false
    }
  },
  computed: {
    status() {
      if (this.gameOver) {
        if (this.winner) {
          return this.winner === 'X' ? 'You win!' : 'AI wins!'
        } else {
          return "It's a draw!"
        }
      } else {
        return `Your turn`
      }
    },
    winner() {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ]
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
          return this.board[a]
        }
      }
      return null
    }
  },
  methods: {
    makeMove(index) {
      if (this.board[index] === '' && !this.gameOver && this.currentPlayer === 'X') {
        this.board[index] = 'X'
        if (this.checkWinner()) {
          this.gameOver = true
        } else if (this.checkDraw()) {
          this.gameOver = true
        } else {
          this.currentPlayer = 'O'
          this.$nextTick(() => {
            this.aiMove()
          })
        }
      }
    },
    aiMove() {
      if (!this.gameOver) {
        const bestMove = this.findBestMove()
        this.board[bestMove] = 'O'
        if (this.checkWinner()) {
          this.gameOver = true
        } else if (this.checkDraw()) {
          this.gameOver = true
        } else {
          this.currentPlayer = 'X'
        }
      }
    },
    findBestMove() {
      let bestScore = -Infinity
      let bestMove
      for (let i = 0; i < 9; i++) {
        if (this.board[i] === '') {
          this.board[i] = 'O'
          let score = this.minimax(this.board, 0, false)
          this.board[i] = ''
          if (score > bestScore) {
            bestScore = score
            bestMove = i
          }
        }
      }
      return bestMove
    },
    minimax(board, depth, isMaximizing) {
      if (this.checkWinner()) {
        return this.winner === 'O' ? 10 - depth : depth - 10
      } else if (this.checkDraw()) {
        return 0
      }

      if (isMaximizing) {
        let bestScore = -Infinity
        for (let i = 0; i < 9; i++) {
          if (board[i] === '') {
            board[i] = 'O'
            let score = this.minimax(board, depth + 1, false)
            board[i] = ''
            bestScore = Math.max(score, bestScore)
          }
        }
        return bestScore
      } else {
        let bestScore = Infinity
        for (let i = 0; i < 9; i++) {
          if (board[i] === '') {
            board[i] = 'X'
            let score = this.minimax(board, depth + 1, true)
            board[i] = ''
            bestScore = Math.min(score, bestScore)
          }
        }
        return bestScore
      }
    },
    checkWinner() {
      return this.winner !== null
    },
    checkDraw() {
      return this.board.every(cell => cell !== '')
    },
    restartGame() {
      this.board = Array(9).fill('')
      this.currentPlayer = 'X'
      this.gameOver = false
    }
  }
}).mount('#app')
