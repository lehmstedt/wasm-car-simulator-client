
import { Camera, State, update } from 'wasm-car-simulator'
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

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d");

const screen_size = 1000

const road = new Image(screen_size, screen_size)
road.src = "road.png";

const car = new Image(100, 100)
car.src = "car.png"

let elapsedTime = 0

const camera = new Camera(screen_size, 10000);
camera.world_position = 5000;

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
    ctx.fillText(`You took ${elapsedTime} ms`, 500, 600)
    return
  }
  camera.world_position = newState.position
  throttle = 0
  ctx.reset()
  ctx.drawImage(road, 0, camera.project(0), road.width, road.height);
  ctx.drawImage(road, 0, camera.project(10000), road.width, road.height);
  ctx.drawImage(road, 0, camera.project(20000), road.width, road.height);
  ctx.drawImage(road, 0, camera.project(30000), road.width, road.height);
  ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
  ctx.fillRect(0, camera.project(25000), screen_size, 500)
  ctx.font = "20px sans-serif";
  ctx.drawImage(car, 500, camera.project(newState.position) -50, car.width, car.height);

  ctx.fillStyle = "black"
  ctx.fillText(`Speed: ${newState.speed}`, 50, 50)
  ctx.fillText(`Elapsed time: ${elapsedTime}`, 50, 70)

  elapsedTime += 10


  setTimeout(() => updateGame(ctx, newState), 10)
}

const runANewGame = () => {
  if(ctx){
    elapsedTime = 0
    const state = new State()
    state.position_goal_start = 20000
    state.position_goal_end = 25000

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
})

const restartButton = document.getElementById("restart")
if(restartButton){
  restartButton.addEventListener("click", () => runANewGame())
}

runANewGame()




