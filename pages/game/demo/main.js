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

        if(this.element.obj){

        }
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
        for(let y = 0; y < this.size.y; y++){
            this.matrix.push(new Array(this.size.x).fill(null));
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

        if(this.map.matrix[y][x].isPiece !== 0){
            this.counter--;
            return;
        }

        const grid = this.map.matrix[y][x];

        if(grid.isPiece != 0){
            grid.changePiece(player);
            return;
        }

        switch (grid.direction){
            case 'down':
                if((y + 1) >= this.map.size.y){
                    grid.changePiece(player);
                    this.judge(x, y, player);
                    return;
                }
                if (this.map.matrix[y + 1][x] == null){
                    grid.changePiece(player);
                    this.judge(x, y, player);
                    return;
                }
                if (this.map.matrix[y + 1][x].obj){
                    grid.changePiece(player);
                    this.judge(x, y, player);
                    return;
                }
                if (this.map.matrix[y + 1][x].isPiece != 0) {
                    grid.changePiece(player);
                    this.judge(x, y, player);
                    return;
                }

                grid.changePiece(player);
                await new Promise(resolve => setTimeout(resolve, 50));
                grid.changePiece(0);
                
                this.input(x, y + 1, player);
                return
        }
    }

    createMatrix(){
        const mapMatrix = [];
        for(let i = 0; i < this.map.size.y; i++) mapMatrix.push(new Array(this.map.size.x));
    
        for(let i = 0; i < this.map.size.y; i++){
            for(let j = 0; j < this.map.size.x; j++){
    
                if(this.map.matrix[i][j] == null) {
                    mapMatrix[i][j] = 0;
                } else if(this.map.matrix[i][j].obj){ 
                    mapMatrix[i][j] = 0;
                } else {
                    mapMatrix[i][j] = this.map.matrix[i][j].isPiece;
                }
    
                console.log(this.map.matrix[i][j].isPiece);
            }
        }

        return mapMatrix;
    }

    judge(x, y, player){
        const mapMatrix = this.createMatrix();
        let flag = false;
        if(this.judgeCol(mapMatrix, x, y, player)) flag = true;
        if(this.judgeRow(mapMatrix, x, y, player)) flag = true;
        if(this.judgeDiag1(mapMatrix, x, y, player)) flag = true;
        if(this.judgeDiag2(mapMatrix, x, y, player)) flag = true;
        
        if(flag){
            document.getElementById('judge').textContent = player == 1 ? 'Blue win!' : 'Red win!';
            document.getElementById('judge').style.color = player == 1 ? 'blue' : 'red';

            const reloadButton = document.createElement('button');
            reloadButton.textContent = 'retry';
            reloadButton.addEventListener('click', () => {
                location.reload();
            })
            document.body.appendChild(reloadButton);
        }
    }

    judgeCol(mapMatrix, x, y, player){
        let yp = 0;
        let ym = 0;
        for(;;){

            if(y + yp + 1 >= this.map.size.y){
                break;
            }

            if(mapMatrix[y + yp + 1][x] != player){
                break;
            }

            yp++;
        
        }

        for(;;){
            if(y + ym - 1 < 0){
                break;
            }

            if(mapMatrix[y - ym -1][x] != player){
                break
            }

            ym++;

        }


        if(yp + ym + 1 >= 4){
            return true;
        } else {
            return false;
        }
    }

    judgeRow(mapMatrix, x, y, player){
        let xp = 0;
        let xm = 0;

        for(;;){

            if(x + xp + 1 >= this.map.size.x){
                break;
            }

            if(mapMatrix[y][x + xp + 1] != player){
                break;
            }

            xp++;

        }

        for(;;){

            if(x - xm - 1 < 0){
                break;
            }

            if(mapMatrix[y][x - xm - 1] != player){
                break;
            }

            xm++
        }

        console.log('xm : ' + xm);
        console.log('xp : ' + xp);

        if(xp + xm + 1 >= 4){
            return true;
        } else {
            return false;
        }
    }

    judgeDiag1(mapMatrix, x, y, player){
        let p = 0;
        let m = 0;

        for(;;){

            if(x + p + 1 >= this.map.size.x){
                break;
            }
            if(y + p + 1 >= this.map.size.y){
                break;
            }

            if(mapMatrix[y + p + 1][x + p + 1] != player){
                break;
            }

            p++;

        }

        for(;;){

            if(x - m - 1 < 0){
                break;
            }
            if(y - m - 1 < 0){
                break;
            }

            if(mapMatrix[y - m - 1][x - m - 1] != player){
                break;
            }

            m++
        }

        if(p + m + 1 >= 4){
            return true;
        } else {
            return false;
        }
    }

    judgeDiag2(mapMatrix, x, y, player){
        let p = 0;
        let m = 0;

        for(;;){

            if(x + p + 1 >= this.map.size.x){
                break;
            }
            if(y - p - 1 < 0){
                break;
            }

            if(mapMatrix[y - p - 1][x + p + 1] != player){
                break;
            }

            p++;

        }

        for(;;){

            if(x - m - 1 < 0){
                break;
            }
            if(y + m + 1 >= this.map.size.y){
                break;
            }

            if(mapMatrix[y + m + 1][x - m - 1] != player){
                break;
            }

            m++
        }

        if(p + m + 1 >= 4){
            return true;
        } else {
            return false;
        }
    }

}


const map = new Map(6, 10);
for(let x = 0; x < 6; x++){
    for(let y = 0; y < 10; y++){
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