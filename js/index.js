$(document).ready(function () {
  const ROLE_COLOR_CLASS = ['btn-primary', 'btn-info', 'btn-success', 'btn-danger', 'btn-warning'];
  const GAMES_ROWS = [3, 5, 7];
  var gameActionHistory = [];
  var pendingRoleList = ['S', 'D', 'W'];
  var activeRolesList = ['O', 'X'];
  var activeRoleIndex = 0;
  var gameSize = 3;
  var game2DArray;

  function init2DArray() {
	// Make sure gameSize is a number
    gameSize = isNaN(gameSize) ? parseInt(gameSize, 10) : gameSize;
    game2DArray = Array(gameSize)
      .fill(null)
      .map(() => Array(gameSize).fill(0));
  }

  function update2DArray(id, role) {
    var [row, col] = id.split('_');
    game2DArray[row][col] = role;
  }

  function isWinGame(id) {
    var [row, col] = id.split('_');
    row = parseInt(row, 10);
    col = parseInt(col, 10);
    var isRowComplete = true,
      isColComplete = true,
      isLeftCrossComplete = false,
      isRightCrossComplete = false;
    // check row
    for (var i = 0; i < gameSize; i++) {
      if (game2DArray[row][i] !== activeRolesList[activeRoleIndex]) isRowComplete = false;
    }
    // check column
    for (var j = 0; j < gameSize; j++) {
      if (game2DArray[j][col] !== activeRolesList[activeRoleIndex]) isColComplete = false;
    }

    // check cross if row === col or row + col = gameSize
    if (row === col || row + col === gameSize - 1) {
      isLeftCrossComplete = true;
      isRightCrossComplete = true;
      for (var k = 0; k < gameSize; k++) {
        if (game2DArray[k][k] !== activeRolesList[activeRoleIndex]) isLeftCrossComplete = false;
        if (game2DArray[k][gameSize - 1 - k] !== activeRolesList[activeRoleIndex]) isRightCrossComplete = false;
      }
    }

    return isRowComplete || isColComplete || isLeftCrossComplete || isRightCrossComplete;
  }

  function createMsgCardDOM() {
    var msgCard = $('#tic_tac_toe .card-body');
    msgCard.empty();
    activeRolesList.forEach(function (role) {
      msgCard.append(`<div>Role ${role} Won: <span id="${role}_win">0</span> times</div>`);
    });
  }

  function createGameBtnsDOM() {
    var gamePanel = $('#tic_tac_toe #game');
    gamePanel.empty();
    for (var i = 0; i < gameSize; i++) {
      var rowDataDOM = '';
      for (var j = 0; j < gameSize; j++) {
        rowDataDOM += `<div id="${i}_${j}" class="btn">+</div>`;
      }
      gamePanel.append(`<div class="game-row">${rowDataDOM}</div>`);
    }
  }

  function restartGame() {
    var allColors = ROLE_COLOR_CLASS.join(' ');
    activeRoleIndex = 0;
    gameActionHistory = [];
    init2DArray();
    $('#game .btn').text('+');
    $('#game .btn').removeClass(`disable ${allColors}`);
  }

  function processGame(id) {
    var role = activeRolesList[activeRoleIndex];
    var btnColor = ROLE_COLOR_CLASS[activeRoleIndex];

    gameActionHistory.push(id);
    update2DArray(id, role);
    $(`#${id}`).text(role).addClass(`disable ${btnColor}`);
    var isWin = isWinGame(id);
    if (isWin) {
      setTimeout(function () {
        alert(`${role} has won the game. Please start a new game`);
        var roleTxtDom = $(`#${role}_win`);
        roleTxtDom.text(parseInt(roleTxtDom.text(), 10) + 1);
      }, 0);
    } else {
      activeRoleIndex = ++activeRoleIndex % activeRolesList.length;
    }
  }

  function undoGame() {
    if (gameActionHistory.length === 0) return;
    var undoId = gameActionHistory.pop();
    var isWin = isWinGame(undoId);

    if (isWin) {
      setTimeout(function () {
        alert('Can not undo when game complete');
      }, 0);
    } else {
      activeRoleIndex = activeRoleIndex === 0 ? activeRolesList.length - 1 : --activeRoleIndex;
      var btnColor = ROLE_COLOR_CLASS[activeRoleIndex];
      update2DArray(undoId, 0);
      $(`#${undoId}`).text('+').removeClass(`disable ${btnColor}`);
    }
  }

  function addPlayer() {
    restartGame();
    var newPlayer = pendingRoleList.shift();
    activeRolesList.push(newPlayer);
    createMsgCardDOM();
  }

  function removePlayer() {
    restartGame();
    var quitPlayer = activeRolesList.pop();
    pendingRoleList.unshift(quitPlayer);
    createMsgCardDOM();
  }

  function updateGameSize(size) {
    gameSize = parseInt(size.split('_')[1], 10);
    $('#tic_tac_toe').removeClass().addClass(size);
    init2DArray();
    createGameBtnsDOM();
    // Need to rebind the event listioner
    bindGamePanel();
  }

  function initGame() {
    activeRoleIndex = 0;
    gameActionHistory = [];
    init2DArray();
    createMsgCardDOM();
    createGameBtnsDOM();
    // Need to rebind the event listioner
    bindGamePanel();
  }

  initGame();
  // All event handler
  function bindGamePanel() {
    $('#game .btn').click(function () {
      var id = $(this)[0].id;
      if ($(this).hasClass('disable')) {
        alert('Already selected');
      } else {
        processGame(id);
      }
    });
  }

  $('#restart').click(function () {
    restartGame();
  });

  $('#reset').click(function () {
    initGame();
  });

  $('#undo').click(function () {
    undoGame();
  });

  $('#add_player').click(function () {
    addPlayer();
  });
  $('#remove_player').click(function () {
    removePlayer();
  });

  $('.size-setting').click(function () {
    updateGameSize($(this)[0].id);
  });

  $('#sidebar_collapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });
});
