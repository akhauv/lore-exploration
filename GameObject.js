class GameObject {
    constructor(config) {
      this.id = null;
      this.isMounted = false;
      this.x = config.x || 0;
      this.y = config.y || 0;
      this.trueY = config.trueY || this.y;
      this.direction = config.direction || "down"; 
      this.sprite = new Sprite({
        gameObject: this,
        src: config.src || "images/characters/player-shadow.png",
        state: config.state || "person",
      });
      this.state = config.state || "person";

      // if(this.objectState === "static") {
      //   this.sprite = new StaticObject({
      //     gameObject: this,
      //     src: config.src || "images/characters/player-shadow.png",
      //   });
      // }
      // else{
      //   this.sprite = new Sprite({
      //     gameObject: this,
      //     src: config.src || "images/characters/player-shadow.png",
      //   });
      // }

      this.behaviorLoop = config.behaviorLoop || [];
      this.behaviorLoopIndex = 0;

      this.talking = config.talking || [];
    }

    mount(map) {
      this.isMounted = true;
      console.log(this.state);
      if(this.state === "person"){
        map.addWall(this.x, this.y);
      }

      //if we have a behavior, kick off after a short delay
      setTimeout(() => {
        this.doBehaviorEvent(map);
      }, 10)
    }

    update(){
    }

    async doBehaviorEvent(map){
      if(map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
        return;
      }

      //setting up our event with relevant info
      let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
      eventConfig.who = this.id; //make sure that an event has a "who" defined

      //create an event instance out of our next event config
      const eventHandler = new SonderEvent({map, event: eventConfig});
      //SonderEvent contains the code which instructs the peopel to do the things
      await eventHandler.init(); 
      //bc of await, nothing below that line is going to execute until it comes back
      // as finished. 
      //in order to use await, then functions must be marked as async

      //setting the next event to fire
      this.behaviorLoopIndex += 1; 
      if (this.behaviorLoopIndex == this.behaviorLoop.length) {
        this.behaviorLoopIndex = 0;
      }

      this.doBehaviorEvent(map);
    }
}