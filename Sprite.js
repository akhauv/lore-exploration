class Sprite {
    constructor(config) {

      this.state = config.state;
  
      //Set up the image
      this.image = new Image();
      this.image.src = config.src;
      this.image.onload = () => {
        this.isLoaded = true;
      }
  
      //Configure Animation & Initial State
      this.animations = config.animations || {
        "idle-down" : [ [0,0] ],
        "idle-right": [ [0,0] ],
        "idle-up"   : [ [2,0] ],
        "idle-left" : [ [1,0] ],
        "walk-down" : [ [0,2], [1,2], [2, 2], [3,2] ],
        "walk-right": [ [0,3], [1,3], [2, 3], [3,3] ],
        "walk-up"   : [ [0,1], [1,1], [2, 1], [3,1] ],
        "walk-left" : [ [0,4], [1,4], [2, 4], [3,4] ],
      }
      this.currentAnimation = config.currentAnimation || "idle-down";
      this.currentAnimationFrame = 0;

      this.animationFrameLimit = config.animationFrameLimit || 8;
      this.animationFrameProgress = this.animationFrameLimit;

      //Reference the game object
      this.gameObject = config.gameObject;
    }

    get frame() {
      return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key) {
      if(this.currentAnimation != key) {
        this.currentAnimation = key;
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameLimit;
      }
    }

    updateAnimationProgress() {
      //downtick frame progress counter
      if (this.animationFrameProgress > 0){
        this.animationFrameProgress -= 1; 
        return;
      }

      //reset counter
      this.animationFrameProgress = this.animationFrameLimit;
      this.currentAnimationFrame += 1;
      if(this.frame === undefined) {
        this.currentAnimationFrame = 0;
      }
    }
  
    draw(ctx) {
      if(this.state === "person") {
        const x = this.gameObject.x -4;
        const y = this.gameObject.y -8;
  
        const [frameX, frameY] = this.frame;
        
        this.isLoaded && ctx.drawImage(this.image,
          frameX * 16, frameY * 16, //where to splice
          16,16, //splice dimensions
          x,y, //location
          16,16 //resize
        ) 
  
        this.updateAnimationProgress();
      }
      else{
        this.isLoaded && ctx.drawImage(this.image,
          this.gameObject.x, this.gameObject.y, //location
        ) 
      }
    }
  }