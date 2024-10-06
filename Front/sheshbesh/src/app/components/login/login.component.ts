import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { LoginAuthService } from '../../services/loginAuth/login-auth.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as Matter from 'matter-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit{
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  engine!: Matter.Engine;
  render!: Matter.Render;
  runner!: Matter.Runner;
  constraintLeft!: Matter.Constraint;
  constraintRight!: Matter.Constraint;
  hangingDiv!: Matter.Body;
  flowerLeftClicks = 0;
  flowerRightClicks = 0;
  constructor(public loginAuthService: LoginAuthService){}
  playAsGuest(){

  }  
  register() {
    const registrationUrl = '/register'; // Change this to your actual registration route
    const windowFeatures = 'width=600,height=800,left=100,top=100'; // Customize as needed
    window.open(registrationUrl, '_blank', windowFeatures);
  }
  saveUsername = false;  // To track the state of "Save Username"
  rememberMe = false;    // To track the state of "Remember Me"

  onSaveUsernameChange() {
    // This method can be used for additional logic if needed
    if(this.saveUsername === false){
      this.rememberMe = false;
    }
  }

  ngAfterViewInit(): void {
    this.setupMatterJS();
  }

  setupMatterJS() {
    // Create the Matter.js engine
    this.engine = Matter.Engine.create();

    // Create a new canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'matter-canvas';
    this.canvasContainer.nativeElement.appendChild(canvas); // Append the canvas to the container

    // Create a renderer with the created canvas
    this.render = Matter.Render.create({
      element: this.canvasContainer.nativeElement, // Attach to the container
      engine: this.engine,
      canvas: canvas,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
      },
    });


    // Create bodies
    this.hangingDiv = Matter.Bodies.rectangle(250, 0, 400, 300, {isSleeping: true});
    const floor = Matter.Bodies.rectangle(0, 850, 3200, 100, { isStatic: true });
    // Add bodies to the world
    Matter.World.add(this.engine.world, [this.hangingDiv, floor]);
    this.constraintRight = Matter.Constraint.create({
      bodyA: this.hangingDiv,
      pointA: { x: 159, y: -195},
      pointB: { x: 360, y: 50 }, // Top left corner of flower1
      stiffness: 1,
      length: 0,
    });
      this.constraintLeft = Matter.Constraint.create({
      bodyA: this.hangingDiv,
      pointA: { x: -180, y: -195},
      pointB: { x: 20, y: 50 }, // Top left corner of flower1
      stiffness: 1,
      length: 0,
    });
    Matter.World.add(this.engine.world, [this.constraintLeft, this.constraintRight]);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, this.engine);
    // Run the engine and renderer
    Matter.Runner.run(this.engine);
    Matter.Render.run(this.render);

    this.updateDivPosition();
}

  updateHangingDiv(flower: number) {
    const hangingDiv = this.engine.world.bodies[0]; // Adjust according to the order of bodies
    if (flower === 1 && this.flowerLeftClicks === 4) {
      Matter.World.remove(this.engine.world, this.constraintLeft)

    } else if (flower === 2 && this.flowerRightClicks === 4) {
      Matter.World.remove(this.engine.world, this.constraintRight)
    }
  }

  handleFlowerClick(flower: number) {
    if (flower === 1) {
      this.flowerLeftClicks++;
      this.updateHangingDiv(flower);
    } else {
      this.flowerRightClicks++;
      this.updateHangingDiv(flower);
    }
  }

  updateDivPosition() {
    const update = () => {
      const { x, y } = this.hangingDiv.position;
      const angle = this.hangingDiv.angle;
  
      // Update the position of the login-box
      const loginBox = document.querySelector('.login-box') as HTMLElement;
      
      // Correcting the syntax for the transform property
      loginBox.style.transform = `translate(${x - 200}px, ${y - 150}px) rotate(${angle}rad)`; // Adjust offset for centering
  
      requestAnimationFrame(update);
    };
  
    requestAnimationFrame(update);
  }

}