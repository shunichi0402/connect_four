'use stript'

const config = {
    gridElementSize:{height: '100px', width:'100px'},
}

class Grid{
    constructor(direction = 0, objFlag = false, inputFlag = false){
        switch(direction){
            case 0 :
            case 'down' :
                this.direction = 'down';
                break;

            case 1 :
            case 'up' :
                this.direction = 'up';
                break;

            case 2 :
            case 'left' :
                this.direction = 'left';
                break;

            case 3:
            case 'right' :
                this.direction = 'right';
                break;
            
            default :
                throw 'direction is incorrect';
        }

        this.obj = objFlag;
        this.input = inputFlag;

        this.element
        this.initElement()

        this.isPiece = 0;
    }

    initElement(){
        this.element = document.createElement('div');
        this.element.classList.add('grid-element');
    }

    changePiece(player){

        let color = '';

        this.isPiece = player;

        switch(player){
            case 0:
                color = '';
                break;
            case 1:
                color = 'blue';
                break;
            case 2:
                color = 'red';
                break;
        }

        this.element.style.backgroundColor = color;

    }
}

class Map{
    constructor(sizeX = 6, sizeY = 6){
        this.size = {x:sizeX, y:sizeY};
        this.matrix = [];
        this.initMap();
    }

    initMap(){
        for(let x = 0; x < this.size.x; x++){
            this.matrix.push(new Array(this.size.y).fill(null));
        }
    }

    setGrid(grid, x, y){
        if(x < this.size.x && y < this.size.y){
            this.matrix[y][x] = grid;
        } else {
            throw 'size is incorrect';
        }
    }
}

class Game{
    constructor(map){
        this.map = map;
        this.player = 2;
        this.counter = 0;
    }

    initDisplay(pearentElement){
        let grdTmpRow = '';
        for(let i = 0; i < this.map.size.y; i++){
            grdTmpRow += config.gridElementSize.height + ' ';
        }

        let grdTmpCol = '';
        for(let i = 0; i < this.map.size.x; i++){
            grdTmpCol += config.gridElementSize.width + ' ';
        }

        pearentElement.style.display = 'grid';
        pearentElement.style.gridTemplateRows = grdTmpRow;
        pearentElement.style.gridTemplateColumns = grdTmpCol;

        for(let y = 0; y < this.map.size.y; y++){
            for(let x = 0; x < this.map.size.x; x++){

                if(this.map.matrix[y][x] != null){
                    pearentElement.appendChild(this.map.matrix[y][x].element);
                    this.map.matrix[y][x].element.style.gridRow = ` ${y + 1} / ${y + 2}`;
                    this.map.matrix[y][x].element.style.gridColumn = `${x + 1} / ${x + 2}`;
                }

            }
        }
    }

    initInput(){
        for (let y = 0; y < this.map.size.y; y++) {
            for (let x = 0; x < this.map.size.x; x++) {

                if (this.map.matrix[y][x] != null) {
                    if (this.map.matrix[y][x].input){
                        this.map.matrix[y][x].element.
                        addEventListener('click', () => {this.input(x, y, (this.counter++ % this.player) + 1)});
                    }
                }

            }
        }
    }

    async input(x, y, player){
        console.log(x, y);
        const grid = this.map.matrix[y][x];
        console.log(player);

        if(grid.isPiece != 0){
            grid.changePiece(player);
            return;
        }

        switch (grid.direction){
            case 'down':
                if((y + 1) >= this.map.size.y){
                    grid.changePiece(player);
                    return;
                }
                if (this.map.matrix[y + 1][x] == null){
                    grid.changePiece(player);
                    return;
                }
                if (this.map.matrix[y + 1][x].obj){
                    grid.changePiece(player);
                    return;
                }
                if (this.map.matrix[y + 1][x].isPiece !== 0) {
                    grid.changePiece(player);
                    return;
                }

                grid.changePiece(player);
                await new Promise(resolve => setTimeout(resolve, 500));
                grid.changePiece(0);
                
                this.input(x, y + 1, player);
                return
        }
    }

}


const map = new Map();
for(let x = 0; x < 6; x++){
    for(let y = 0; y < 6; y++){
        if(y == 0){
            map.setGrid(new Grid(0, false, true), x, y);
        } else {
            map.setGrid(new Grid(0, false, false), x, y);
        }
    }
}

const game = new Game(map);
const gameElemet = document.getElementById('app');
console.log(game);
game.initDisplay(gameElemet);
game.initInput();
console.log(game.map.matrix[5][2].element);