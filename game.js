//function handleFiles (event){
//    var reader = new FileReader();
//    var file = event.target.files[0];
//    reader.onload = function(event) {
//  };
//  reader.readAsText(file);
//}

var gameOfLife = {
  
  width: 12, 
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  createAndShowBoard: function () {
    
    // create <table> element
    var goltable = document.createElement("tbody");
    
    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    
    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);
    
    //setup Button events
    var clear_btn = document.getElementById('clear_btn');
    clear_btn.addEventListener('click', e => {
      this.forEachCell(function (cell) {
        cell.className = 'dead';
        cell.dataset.status = 'dead';
      })
    })
    var reset_btn = document.getElementById('reset_btn');
    reset_btn.addEventListener('click', e => {
      this.forEachCell(function (cell) {
        var status = Math.round(Math.random())
        cell.className = status ? 'dead' : 'alive';
        cell.dataset.status = status ? 'dead' : 'alive';
      })
    })
    var step_btn = document.getElementById('step_btn');
    step_btn.addEventListener('click', this.step.bind(this));
    var play_btn = document.getElementById('play_btn');
    play_btn.addEventListener('click', this.enableAutoPlay.bind(this));

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    /* 
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
    var cell00 = document.querySelectorAll('td');
    // cell00.forEach(iteratorFunc.bind(document.body));
    cell00.forEach((cell, i) => iteratorFunc(cell, i));
  },
  
  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y" 
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "click" events that allow a user to click on 
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play"
    
    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white
    
    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board
    
    var onCellClick = function (e) {
      // console.log(this)
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?
      
      // how to set the style of the cell when it's clicked
      if (this.dataset.status == 'dead') {
        this.className = 'alive';
        this.dataset.status = 'alive';
      } else {
        this.className = 'dead';
        this.dataset.status = 'dead';
      }
      
    };
    
    this.forEachCell(x => x.addEventListener('click', onCellClick));
  },

  getNeighbors: function(i) {
    //toprow
    if (i < 12) {
      var toprow = []
    } else {

      if (i % 12 == 0) {
        var toprow = [i-12, i-11]
      } else if (i % 12 == 11) {
        var toprow = [i-13, i-12]
      } else {
        var toprow = [i-13, i-12, i-11]
      }
    }
    //midrow
    if (i % 12 == 0) {
      var midrow = [i + 1]
    } else if (i % 12 == 11) {
      var midrow = [i - 1]
    } else {
      var midrow = [i-1, i+1]
    }
    //botrow
    if (i > (143 - 12)) {
      var botrow = []
    } else {

      if (i % 12 == 0) {
        var botrow = [i+13, i+12]
      } else if (i % 12 == 11) {
        var botrow = [i+12, i+11]
      } else {
        var botrow = [i+13, i+12, i+11]
      }
      
    }
    return toprow.concat(midrow.concat(botrow))
  },


  step: function () {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game. 
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
    
    var oldState = []
    this.forEachCell((cell) => {oldState.push(cell.dataset.status)})
    var newState = []

    oldState.forEach((v, i) => {
        var neighbors = this.getNeighbors(i)
          neighbors = neighbors.filter(x => oldState[x]==='alive')
          switch (neighbors.length){
            case 2:
            case 3:
              newState.push('alive')
              break;
            default:
              newState.push('dead')
          }
          this.forEachCell((cell, i) => {
            var status = newState[i]
            cell.className = status;
            cell.dataset.status = status;
          })
    })
      
  },

    handleFiles: function (event){
        var reader = new FileReader();
        var file = event.target.files[0];
        reader.onload = function(event) {
            var lines = event.target.result.split('\n').slice(2, -1);
            var cells = lines.map(x => x.split('').map(y => y === '.'? 'dead' : 'alive'));
    //        console.log(lines);
            var acornTable = [];
                for (var i = 0; i < 12; i++){
                    for (var j = 0; j < 12; j++){
                        if(cells.length > i && cells[i].length > j){
                            //means column is within bounds
                            acornTable.push(cells[i][j]);
                        } else {
                            acornTable.push('dead');
                        }
                    }
                }
              gameOfLife.forEachCell((cell, i) => {
                var status = acornTable[i];
                cell.className = status;
                cell.dataset.status = status;
              })
            };
        reader.readAsText(file);
    },
    
  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval  
    if (!this.stepInterval) {
      // kick it off
      this.stepInterval = setInterval(this.step.bind(this), Number(prompt("how fast do you want it", 200)))
    } else {
      // kill it
      clearInterval(this.stepInterval);
      this.stepInterval = null
    }
  }
  
};

gameOfLife.createAndShowBoard();
