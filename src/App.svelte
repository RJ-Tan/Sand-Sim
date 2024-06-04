<script lang="ts">
  import { onMount } from "svelte";
  import {Sim} from "./lib/Sim";
  import {Cell, CellType} from "./lib/Cell";

  function resize(canvas:HTMLCanvasElement){
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    console.log("this ransss")
    sim = new Sim(canvas);
  }

  let sim: Sim;
  let context2D: CanvasRenderingContext2D;
  let currentCanvasMouseLoc: [number, number];
  let mouseDownOnCanvas:boolean = false;

  let lastRender: number = 0;
  let selected:string;
  let reset:boolean = false;
  let counter = 0;
  let elapsedTime:number = 0;

  let options:({id:CellType, text:string})[] = [];

  for (let i=1; i<=(Object.keys(CellType).length)/2;i++){
    options.push({"id":i, "text":CellType[i]});
  }

  function draw(simObj:Sim,ctx:CanvasRenderingContext2D){
    let cellMat = simObj.getCellMatrix();
    context2D.clearRect(0,0,context2D.canvas.width, context2D.canvas.height);

    for (let i=0; i<cellMat.length; i++){

      for (let j=0; j<cellMat[i].length;j++){
        if (cellMat[i][j] != null){
          //console.log(cellMat[i][j]!.getColour());
          context2D.fillStyle = cellMat[i][j]!.getColour();
          context2D.fillRect(j, i, 1, 1);

        }

      }

    }
  }

  let looping: boolean = true;
  $:fpsCount = 0;
  $:pauseBtnString = "Pause";

  function loop(timestamp:number){
    elapsedTime = timestamp - lastRender;
    counter++;
    
    if (looping){
      
      //console.log(timestamp-lastRender);
      if (mouseDownOnCanvas==true){
        //console.log(currentCanvasMouseLoc);
        sim.addCell(currentCanvasMouseLoc[1], currentCanvasMouseLoc[0], parseInt(selected));
        
      }
      
      if (reset==true){
        sim.reset();
        reset=false;
      }
      else{
        sim.update();
      }
      
      draw(sim, context2D);
      //console.log(`${context2D.canvas.width} ${context2D.canvas.height}`);
      //console.log(`${sim.getCellMatrix().length} ${sim.getCellMatrix()[0].length}`)
      
      
      if (counter>=10){
        fpsCount = Math.round(counter/((timestamp-lastRender)/1000));
        counter = 0;
        lastRender=timestamp;
        
      }
      
    } else{
      fpsCount = 0;

      //console.log("Loop is off");
    }
    
    window.requestAnimationFrame(loop);
    
  }
  
  onMount(()=>{

    const canvas:HTMLCanvasElement = (document.getElementById("canvas") as HTMLCanvasElement);
    context2D = (canvas.getContext("2d") as CanvasRenderingContext2D);

    window.onresize = ()=>{resize(canvas)};
    resize(canvas); //canvas resolution changes based on viewport size
  
    sim = new Sim(canvas);

    console.log(`${canvas.width} ${canvas.height}`);
    console.log(`${sim.getCellMatrix().length} ${sim.getCellMatrix()[0].length}`)

    window.requestAnimationFrame(loop);
    
 
  });

//-----------Mouse Events
function canvasMouseEnter(){

}


function canvasMouseMove(ev:MouseEvent){

  //if (mouseDownOnCanvas){
  let x = ev.clientX;
  let y = ev.clientY;
  let t = (ev.target as HTMLCanvasElement);
  
  let canvX = Math.trunc(x - t.getBoundingClientRect().left);
  let canvY = Math.trunc(y - t.getBoundingClientRect().top);
  
  //console.log(` ${canvX} ${canvY}`);

  currentCanvasMouseLoc = [canvX, canvY];
  //console.log(currentCanvasMouseLoc)
  //}
  //console.log(` ${x} ${y}`);
}

function canvasMouseDown(ev:MouseEvent){
  mouseDownOnCanvas = true;
}

function canvasMouseUp(){
  mouseDownOnCanvas = false;
}

function pauseBtnClickHandler(){
  looping= !looping;

  if (looping==true){
    pauseBtnString = "Pause";
  }
  else{
    pauseBtnString = "Unpause";
  }
}
</script>

<main>
  <div>FPS:{fpsCount}</div>
  <div>
    <canvas id="canvas" on:mouseenter={canvasMouseEnter} on:mousemove={canvasMouseMove}
      on:mousedown={canvasMouseDown} on:mouseup={canvasMouseUp}>
      
  
    </canvas>

    <select bind:value={selected}>
      {#each options as option}
        <option value={option.id}>
          {option.text}
        </option>
      {/each}
    </select>
  </div>

  <button on:click={pauseBtnClickHandler}>{pauseBtnString}</button>
  <button on:click={()=>{reset=true}}>Reset</button>
  

</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }

  canvas {
      background: #ffffff;
      /*
      height: 80%;
      width: 80%;*/
      display: block
    }

</style>