
import { State, update } from 'wasm-car-simulator'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas" width="1000" height="1000"></canvas>
  </div>
`

let throttle: number = 0;
let stop = false;

const updateGame = (ctx: CanvasRenderingContext2D, state: State) => {
  const newState = update(state, throttle)
  throttle = 0
  ctx.reset()
  ctx.fillStyle = "red"
  ctx.fillRect(500, 900 - newState.position / 10, 10, 10)

  setTimeout(() => updateGame(ctx, newState), 10)
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
const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d");
if(ctx){
    const state = new State()
    updateGame(ctx, state);
}


