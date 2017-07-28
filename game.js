//function handleFiles (event){
//    var reader = new FileReader();
//    var file = event.target.files[0];
//    reader.onload = function(event) {
//  };
//  reader.readAsText(file);
//}

var gameOfLife = {
  
  width: 100, 
  height: 100, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game

  createAndShowBoard: function () {
    
    // create <table> element
    var goltable = document.createElement("tbody");
    
    // build Table HTML
    var tablehtml = '';
    for (var h=0; h<this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w=0; w<this.width; w++) {
        tablehtml += "<td data-status='dead' id='id-" + w + "-" + h + "'></td>";
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
        var status = (Math.random() * 10) > 2
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
    if (i < gameOfLife.width) {
      var toprow = []
    } else {

      if (i % gameOfLife.width == 0) {
        var toprow = [i-gameOfLife.width, i-gameOfLife.width+1]
      } else if (i % gameOfLife.width == gameOfLife.width - 1) {
        var toprow = [i-gameOfLife.width - 1, i-gameOfLife.width]
      } else {
        var toprow = [i-gameOfLife.width - 1, i-gameOfLife.width, i-gameOfLife.width + 1]
      }
    }
    //midrow
    if (i % gameOfLife.width == 0) {
      var midrow = [i + 1]
    } else if (i % gameOfLife.width == gameOfLife.width - 1) {
      var midrow = [i - 1]
    } else {
      var midrow = [i-1, i+1]
    }
    //botrow
    if (i > (gameOfLife.width * gameOfLife.width - 1 - gameOfLife.width)) {
      var botrow = []
    } else {

      if (i % gameOfLife.width == 0) {
        var botrow = [i+gameOfLife.width + 1, i+gameOfLife.width]
      } else if (i % gameOfLife.width == gameOfLife.width - 1) {
        var botrow = [i+gameOfLife.width, i+gameOfLife.width - 1]
      } else {
        var botrow = [i+gameOfLife.width + 1, i+gameOfLife.width, i+gameOfLife.width - 1]
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
    })
    this.forEachCell((cell, i) => {
      var status = newState[i]
      cell.className = status;
      cell.dataset.status = status;
    })
      
  },

    handleFiles: function (event){

        this.forEachCell(function (cell) {
          cell.className = 'dead';
          cell.dataset.status = 'dead';
        })

        var reader = new FileReader();
        var file = event.target.files[0];
        reader.onload = function(event) {
            var lines = event.target.result.split('\n').slice(2, -1);
            var cells = lines.map(x => x.split('').map(y => y === '.'? 'dead' : 'alive'));
            // add buffer to center the inserted cells
            var buffer = Math.max(Math.floor(gameOfLife.width / 2 - cells[0].length / 2),0);
            for (var i = 0; i<cells.length; i++){ // rows
              for (var j=0; j<cells[i].length; j++){ //cols
                var status = cells[i][j];
                var string = 'id-' + (buffer + j) + '-' + (buffer + i)
                var el = document.getElementById(string)
                // console.log(string, el)
                el.className = status;
                el.dataset.status = status;
              }
            }
            // var tempcells = []
            // // buffer top rows
            // for (var c = 0; c < buffer; c++){
            //   tempcells.push(Array(gameOfLife.width).fill('dead'))
            // }
            // // buffer sides and cells
            // for (var c = 0; c < cells.length; c++){
            //   var temprow = []
            //   for (var b = 0; b < gameOfLife.width; b++){
            //     b < buffer ? temprow.push('dead') : temprow.push(cells[c][b - buffer])
            //   }
            //   tempcells.push(temprow)
            // }
            // cells = tempcells
            // //push all these to acorntable
            // var acornTable = [];
            // for (var i = 0; i < gameOfLife.width; i++){
            //     for (var j = 0; j < gameOfLife.width; j++){
            //         if(cells.length > i && cells[i].length > j){
            //             //means column is within bounds
            //             acornTable.push(cells[i][j]);
            //         } else {
            //             acornTable.push('dead');
            //         }
            //     }
            // }
            //   gameOfLife.forEachCell((cell, i) => {
            //     var status = acornTable[i];
            //     cell.className = status;
            //     cell.dataset.status = status;
            //   })
            };
        reader.readAsText(file);
    },
    
  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval  
    if (!this.stepInterval) {
      // kick it off
      this.stepInterval = setInterval(this.step.bind(this), Math.max(document.getElementById('speed').value, 100))
    } else {
      // kill it
      clearInterval(this.stepInterval);
      this.stepInterval = null
    }
  }
  
};

gameOfLife.createAndShowBoard();
