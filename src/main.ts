
import { State, update } from 'wasm-car-simulator'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Try to stop on the green area</h1>
    <p>Use arrow up to throttle and arrow down to brake</p>
    <div>
      <button id="restart">Retry</button>
    </div>
    
    
    <canvas id="canvas" width="1000" height="1000"></canvas>
  </div>
`

let throttle: number = 0;
let stop = false;

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d");

const updateGame = (ctx: CanvasRenderingContext2D, state: State) => {
  const newState = update(state, throttle)

  if(newState.lost){    
    ctx.reset()
    ctx.font = "35px sans-serif";
    ctx.textAlign = "center"
    ctx.fillText("You went too far, maybe try to brake early next time ?", 500, 500)
    return
  }
  if(newState.won){    
    ctx.reset()
    ctx.font = "35px sans-serif";
    ctx.textAlign = "center"
    ctx.fillText("You made it. Want to try to beat you previous score ?", 500, 500)
    return
  }
  throttle = 0
  ctx.reset()
  ctx.fillStyle = "green"
  ctx.fillRect(0, 0, 1000, 100)  
  ctx.fillStyle = "red"
  ctx.fillRect(500, 1000 - newState.position / 10, 10, 10)
  

  setTimeout(() => updateGame(ctx, newState), 10)
}

const runANewGame = () => {
  if(ctx){

    const gameOverParagraph = document.getElementById("game-over")
    if(gameOverParagraph){
      gameOverParagraph.innerText = "Go go go !"
    }
    const state = new State()

    updateGame(ctx, state);
  }
}


document.addEventListener("keydown", (event) => {
  if(event.key === "ArrowUp"){
    throttle = 1;
  }
  if(event.key === "ArrowDown"){
    throttle = -1;
  }
  if(event.key === "Escape"){
    stop = true;
  }
})

const restartButton = document.getElementById("restart")
if(restartButton){
  restartButton.addEventListener("click", () => runANewGame())
}

runANewGame()




