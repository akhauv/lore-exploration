class SonderEvent {
    constructor({map, event}) {
        this.map = map;
        this.event = event;
    }

    stand(resolve) {
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
          map: this.map
        }, {
          type: "stand",
          direction: this.event.direction,
          time: this.event.time
        })
    
        //set up a handler to complete when the correct person is done walking, then complete
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandingComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonStandingComplete", completeHandler)
    }

    walk(resolve) {
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehavior({
          map: this.map
        }, {
          type: "walk",
          direction: this.event.direction,
          retry: true
        })
    
        //set up a handler to complete when the correct person is done walking, then complete
        const completeHandler = e => {
            if(e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonWalkingComplete", completeHandler)
    }

    textMessage(resolve) {
        if(this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.init( document.querySelector("body") )
    }

    changeMap(resolve) {

        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector(".game-container"), () => {
            this.map.sonder.startMap(window.SonderMaps[this.event.map]);
            resolve();

            sceneTransition.fadeOut();
        });
        // this.map.overworld.startMap(window.SonderMaps[this.event.map])
        // resolve();
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}