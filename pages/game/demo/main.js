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
        this.initElement();
    }

    initElement(){
        this.element = document.createElement('div');
        this.element.style.height = '100%';
        this.element.style.width = '100%';
        this.element.style.backgroundColor = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
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

}


const map = new Map()
for(let i = 0; i < 6; i++){
    for(let j = 0; j < 6; j++){
        map.setGrid(new Grid(), i, j);
    }
}

const game = new Game(map);
const gameElemet = document.getElementById('app');
console.log(game);
game.initDisplay(gameElemet);
console.log(game.map.matrix[5][2].element);