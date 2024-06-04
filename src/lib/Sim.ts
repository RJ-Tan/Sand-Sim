//----
import { Cell, Sand, Stone, Water, CellType } from "./Cell";

export class Sim {

    cellMat: (Cell|null)[][];
    xSize: number;
    ySize: number;
    leftRightPropagation:boolean;

    public constructor(canvas:HTMLCanvasElement) {
        this.xSize = canvas.width;
        this.ySize = canvas.height;
        this.leftRightPropagation = true;

        this.cellMat = [];
        for (let i = 0; i < this.ySize; i++){
        
            let row = [];
        
            for (let j=0; j < this.xSize; j++){
                
                row.push(null);
                
            }
        
        this.cellMat.push(row);
        
        }
        
    }
    /*
    public updateCellMatrix(){
        
    }*/

    public getCellMatrix(){
       
        return this.cellMat;
    }

    public update(){
        for (let i = this.ySize-1; i >= 0; i--){
            if (this.leftRightPropagation == true){
                for (let j=0; j < this.xSize; j++){
                    if (this.cellMat[i][j]!=null){
                        let [destX, destY] = this.cellMat[i][j]!.tick(j,i,this.cellMat);
                        let destVal = this.cellMat[destY][destX];
                        this.cellMat[destY][destX] = this.cellMat[i][j];
                        this.cellMat[i][j] = destVal;
    
                    }
    
                    
                }
                this.leftRightPropagation=false;
            }
            else{
                for (let j=this.xSize-1; j >=0; j--){
                    if (this.cellMat[i][j]!=null){
                        let [destX, destY] = this.cellMat[i][j]!.tick(j,i,this.cellMat);
                        let destVal = this.cellMat[destY][destX];
                        this.cellMat[destY][destX] = this.cellMat[i][j];
                        this.cellMat[i][j] = destVal;
    
                    }
    
                    
                }
                this.leftRightPropagation=true;
            }
    }
    }

    /**
     * 
     * @param row Corresponds to a row index on the cell matrix
     * @param col Corresponds to a column index on the cell matrix
     */
    public addCell(row:number,col:number, selectedCell:number){
        let toAdd:Cell|null = null;
        if (selectedCell==CellType.SAND){
            toAdd = new Sand();

        }
        else if (selectedCell==CellType.STONE){
            toAdd = new Stone();
        }
        else if(selectedCell==CellType.WATER){
            toAdd = new Water();
        }
        
        if (toAdd!=null){
            let counter:number = 100;
            for(let i=row;i<Math.min(row+toAdd!.cellSize,this.ySize);i++){

                for(let j=col;j<Math.min(col+toAdd!.cellSize,this.xSize);j++){
    
                    this.cellMat[i][j] = toAdd;
                    
                    counter--;

                    if (counter==0){
                        console.log("broken");
                        break;
                    }
                }
    
            }

        }

    }

    public reset(){
        for (let i = 0; i < this.ySize; i++){
      
            for (let j=0; j < this.xSize; j++){
               
                this.cellMat[i][j]=null;
                
            }
        
        }
    }

}
