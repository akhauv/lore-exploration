class Sonder {
    constructor(config) {
      this.element = config.element;
      this.canvas = this.element.querySelector(".game-canvas");
      this.ctx = this.canvas.getContext("2d");
      this.map = null;
     }

    startGameLoop() {
        const step = () => {

            //clear off canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            //update all objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,
                })
            })

            //draw lower layer
            this.map.drawLowerImage(this.ctx);

            //draw game objects
            Object.values(this.map.gameObjects).sort((a,b) => {
                var aPos = a.trueY;
                var bPos = b.trueY;
                if(a.constructor.name === "Person"){
                    aPos = a.y;
                }
                if(b.constructor.name === "Person"){
                    bPos = b.y;
                }
                return aPos - bPos;
            }).forEach(object => {
                object.sprite.draw(this.ctx);
            })

            //draw upper layer
            this.map.drawUpperImage(this.ctx);

            requestAnimationFrame(() => {
                step(); 
            })
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            // is there a new person to talk to? 
            this.map.checkForActionCutscene()
        })
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                this.map.checkForFootstepCutscene()
            }
        })
      }

    startMap(mapConfig) {
        this.map = new SonderMap(mapConfig);
        this.map.sonder = this;
        this.map.mountObjects();
    }
        
    init() {
        this.startMap(window.SonderMaps.Main);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        this.directionInput.direction; //down

        this.startGameLoop();

        // this.map.startCutscene([
        //     { who: "hero", type:"walk", direction:"down" },
        //     { who: "hero", type:"walk", direction:"down" },
        //     { who: "npcA", type:"walk", direction:"up" },
        //     { who: "npcA", type:"walk", direction:"left" },
        //     { who: "hero", type:"stand", direction:"right" },
        //     { type:"textMessage", text:"WHY HELLO THERE!" },
        // ])
    }
}