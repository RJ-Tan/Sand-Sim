export enum CellType {
      STONE = 1,
      SAND,
      WATER,
      
}

enum CellColours{
      STONE = "#808080",
      SAND = "#704a07",
      WATER="#5fd1ed",

}

enum CellMoves{
      NONE=0,
      UP,
      DOWN,
      LEFT,
      RIGHT,
      UPLEFT,
      UPRIGHT,
      DOWNLEFT,
      DOWNRIGHT 
}

function moveAsNewLocation(x:number, y:number,move:CellMoves):[number,number]{
      let newLoc:[number, number] = [x,y];
      if (move==CellMoves.UP){
            newLoc = [x,y-1];
      }
      else if (move==CellMoves.DOWN){
            newLoc = [x,y+1];
      }
      else if (move==CellMoves.LEFT){
            newLoc = [x-1,y];
      }
      else if (move==CellMoves.RIGHT){
            newLoc = [x+1,y];
      }
      else if (move==CellMoves.UPLEFT){
            newLoc = [x-1,y-1];
      }
      else if (move==CellMoves.UPRIGHT){
            newLoc = [x+1,y-1];
      }
      else if (move==CellMoves.DOWNLEFT){
            newLoc = [x-1,y+1];
      }
      else if (move==CellMoves.DOWNRIGHT){
            newLoc = [x+1,y+1];
      }

      return newLoc;
}

export abstract class Cell{

      restState:boolean;
      cellColour:string;
      cellSize:number;
      cellMass:number;
      hInertia:number;
      energy:number;
      

      constructor(atRest:boolean, colour:string, size:number, mass:number){   
            this.restState = atRest;
            this.cellColour = colour;
            this.cellSize = size;
            this.cellMass = mass;
            this.hInertia = CellMoves.NONE;
            this.energy = 0;
      }

      public getRestState(){
            return this.restState;
      }

      public getColour():string{
            return this.cellColour;
      }

      public getSize():number{
            return this.cellSize;
      }

      abstract tick(x:number, y:number, mat:(Cell|null)[][]):[number,number]


}

export class Stone extends Cell{

      constructor(){
            super(true, CellColours.STONE,4, 4);
      }

      public tick(x:number, y:number, mat:(Cell|null)[][]):[number,number]{
            return [x,y]
      }
}

export class Sand extends Cell{

      constructor(){
            super(false, CellColours.SAND,1,2); 
      }

      private anyDownMovesPossible(x:number,y:number,mat:(Cell|null)[][]):boolean{
            let res = false;
            let h = mat.length;
            let w = mat[0].length;

            if (y>=h-1){
                  return res
            }

            if (x>0 && (!mat[y+1][x]||!(mat[y+1][x-1]))){
                  res = true;
            }
            else if(x<w-1 && (!mat[y+1][x]||!(mat[y+1][x+1]))){
                  res = true;
            }

            return res;
      }

      public tick(x:number, y:number, mat:(Cell|null)[][]):[number,number]{
            let newLoc:[number, number] = [x,y];
            let h = mat.length;
            let w = mat[0].length;

            if ((y==h-1 || !this.anyDownMovesPossible(x,y,mat)) && this.energy>0){
                  let diff = this.energy-this.cellMass*5*(Math.random()*5);
                  this.energy = diff<0 ? 0: diff;
                  if (x>0 && mat[y][x+1]==null && this.hInertia==CellMoves.RIGHT){
                        newLoc = moveAsNewLocation(x,y, CellMoves.RIGHT);
                  }
                  else if(x<w-1 && mat[y][x-1]==null && this.hInertia==CellMoves.LEFT){
                        newLoc = moveAsNewLocation(x,y,CellMoves.LEFT);
                  }
                  else if(x>0 && mat[y][x+1]==null){
                        this.hInertia = CellMoves.RIGHT;
                        newLoc = moveAsNewLocation(x,y,CellMoves.RIGHT);
                  }
                  else if(x<w-1 && mat[y][x-1]==null){
                        this.hInertia = CellMoves.LEFT;
                        newLoc = moveAsNewLocation(x,y, CellMoves.LEFT);
                  }
                  return newLoc;

            }
            
            if (y<h-1){
                  
                  if(mat[y+1][x] == null || mat[y+1][x]!.cellMass < this.cellMass){
                        newLoc = moveAsNewLocation(x, y, CellMoves.DOWN);
                        this.energy = this.energy+1>60? 60:this.energy+1;
                  }
      
                  else if(x<w-1 && x>0 && mat[y+1][x-1]==null && mat[y+1][x+1]==null) {
                        let move =  [CellMoves.DOWNLEFT,CellMoves.DOWNRIGHT].at(Math.trunc(Math.random()*2));
                        newLoc = moveAsNewLocation(x,y, move!);
                  }
                  else if(x>0 && mat[y+1][x-1]==null){
                        newLoc = moveAsNewLocation(x,y, CellMoves.DOWNLEFT);
                        this.hInertia = CellMoves.LEFT;
                        //newLoc = [x-1,y+1];
                  }
                  else if(x<w-1 && mat[y+1][x+1]==null){
                        newLoc = moveAsNewLocation(x,y, CellMoves.DOWNRIGHT);
                        this.hInertia = CellMoves.RIGHT;
                        //newLoc = [x+1,y+1];w
                  }
            
            }

            return newLoc;

      }
}

export class Water extends Cell{

      constructor(){
            super(true, CellColours.WATER,2, 1);
      }

      public tick(x:number, y:number, mat:(Cell|null)[][]):[number,number]{
            let newLoc:[number, number] = [x,y];
            let h = mat.length;
            let w = mat[0].length;

            if (y<h-1 && mat[y+1][x] == null){
                  newLoc[1] = y+1;
                  //console.log(`Old:${x}${y}New:${newLoc}`);
            }
            else if(x<w-1 && x>=0 && mat[y][x+1]==null && mat[y][x-1]==null){
                  newLoc = moveAsNewLocation(x,y,[CellMoves.RIGHT,CellMoves.LEFT][Math.trunc(Math.random()*2)]);
            }
            else if(x<w-1 && x>=0 && mat[y][x+1]!=null && mat[y][x-1]==null){
                  newLoc = moveAsNewLocation(x,y,CellMoves.LEFT);
            }
            
            else if(x<w-1 && x>=0 && mat[y][x+1]==null && mat[y][x-1]!=null){
                  newLoc = moveAsNewLocation(x,y,CellMoves.RIGHT);
            }

            return newLoc;
      }
}