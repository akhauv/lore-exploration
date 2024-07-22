class SonderMap{
    constructor(config) {
        this.sonder = null;
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;
    
        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;
    }

    drawLowerImage(ctx) {
        ctx.drawImage(this.lowerImage, 0, 0)
    }

    drawUpperImage(ctx) {
        ctx.drawImage(this.upperImage, 0, 0)
    }

    isSpaceTaken(currentX, currentY, direction) {
        const{x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key;
            //TODO: determine if this ojbect should actually mount

            object.mount(this);
        })
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;
        for (let i = 0; i < events.length; i++) {
            const eventHandler = new SonderEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }
        this.isCutscenePlaying = false;

        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    checkForActionCutscene() {
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        });
        if(!this.isCutscenePlaying && match && match.talking.length) {
            this.startCutscene(match.talking[0].events)
        }
    }

    checkForFootstepCutscene(){
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
        if(!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events)
        }
    }

    addWall(x, y) {
        this.walls[`${x},${y}`] = true;
    }
    removeWall(x, y) {
        delete this.walls[`${x},${y}`] 
    }
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY)
        const {x, y} = utils.nextPosition(wasX, wasY, direction); 
        this.addWall(x, y);
    }
}

window.SonderMaps = {
    // DemoRoom: {
    //     lowerSrc: "images/maps/DemoLower.png",
    //     upperSrc: "images/maps/DemoUpper.png",
    //     gameObjects: {
    //         hero: new Person({
    //             isPlayerControlled: true,
    //             x: utils.withGrid(5),
    //             y: utils.withGrid(6),
    //         }),
    //         npcA: new Person({
    //             x: utils.withGrid(7), 
    //             y: utils.withGrid(9),
    //             src: "images/characters/people/npc1.png",
    //             behaviorLoop: [
    //                 { type: "stand", direction: "up", time: 800},
    //                 { type: "stand", direction: "left", time: 800},
    //                 { type: "stand", direction: "up", time: 300},
    //                 { type: "stand", direction: "right", time: 1200},
    //             ],
    //             talking: [
    //                 {
    //                     events: [
    //                         { type:"textMessage", text:"I'm busy...", faceHero: "npcA"},
    //                         { type:"textMessage", text:"Go away!" },
    //                         { who: "hero", type: "walk", direction: "up"},
    //                     ]
    //                 }
    //             ]
    //         }),
    //         npcB: new Person({
    //             x: utils.withGrid(8), 
    //             y: utils.withGrid(5),
    //             src: "images/characters/people/npc2.png",
    //             // behaviorLoop: [
    //             //     { type: "walk", direction: "left" },
    //             //     { type: "stand", direction: "up", time: 800},
    //             //     { type: "walk", direction: "up" },
    //             //     { type: "walk", direction: "right" },
    //             //     { type: "walk", direction: "down" },
    //             // ]
    //         })
    //     },
    //     walls: {
    //         [utils.asGridCoord(7, 6)] : true,
    //         [utils.asGridCoord(8, 6)] : true,
    //         [utils.asGridCoord(7, 7)] : true,
    //         [utils.asGridCoord(8, 7)] : true,
    //     },
    //     cutsceneSpaces: {
    //         [utils.asGridCoord(7,4)]: [
    //             {
    //                 events: [
    //                     { who: "npcB", type: "walk", direction: "left"},
    //                     { who: "npcB", type: "stand", direction: "up", time: 500},
    //                     { type: "textMessage", text: "You can't be in there!" },
    //                     { who: "npcB", type: "walk", direction: "right"},
    //                     { who: "npcB", type: "stand", direction: "up", time: 500},
    //                     { who: "hero", type: "walk", direction: "down"},
    //                     { who: "hero", type: "walk", direction: "left"},
    //                 ]
    //             }
    //         ],
    //         [utils.asGridCoord(5,10)]: [
    //             {
    //                 events: [
    //                     { type: "changeMap", map: "Kitchen" }
    //                 ]
    //             }
    //         ]
    //     }  
    // },
    Main: {
        lowerSrc: "images/maps/sonder.png",
        upperSrc: "",
        gameObjects: {
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(10),
                y: utils.withGrid(17),
            }),
            stand: new GameObject({
                x: utils.withGrid(13),
                y: utils.withGrid(13),
                trueY: utils.withGrid(16),
                src: "images/maps/carrot-stand.png",
                state: "static",
                shouldBlock: false,
            }),
            carrots: new GameObject({
                x: utils.withGrid(1),
                y: utils.withGrid(15),
                trueY: utils.withGrid(14),
                src: "images/maps/carrots.png",
                state: "static",
                shouldBlock: false,
            }),
        },
        walls: {
            //borders
            [utils.asGridCoord(3, 11)] : true,
            [utils.asGridCoord(3, 10)] : true,
            [utils.asGridCoord(4, 10)] : true,
            [utils.asGridCoord(5, 10)] : true,
            [utils.asGridCoord(6, 11)] : true,
            [utils.asGridCoord(7, 11)] : true,
            [utils.asGridCoord(8, 11)] : true,
            [utils.asGridCoord(9, 11)] : true,
            [utils.asGridCoord(10, 10)] : true,
            [utils.asGridCoord(11, 10)] : true,
            [utils.asGridCoord(12, 10)] : true,
            [utils.asGridCoord(13, 10)] : true,
            [utils.asGridCoord(14, 10)] : true,
            [utils.asGridCoord(15, 10)] : true,
            [utils.asGridCoord(16, 10)] : true,
            [utils.asGridCoord(17, 10)] : true,
            [utils.asGridCoord(18, 10)] : true,
            [utils.asGridCoord(19, 10)] : true,
            [utils.asGridCoord(20, 11)] : true,
            [utils.asGridCoord(21, 11)] : true,
            [utils.asGridCoord(22, 11)] : true,
            [utils.asGridCoord(23, 10)] : true,
            [utils.asGridCoord(24, 10)] : true,
            [utils.asGridCoord(25, 10)] : true,
            [utils.asGridCoord(26, 10)] : true,
            [utils.asGridCoord(27, 10)] : true,
            [utils.asGridCoord(28, 10)] : true,
            [utils.asGridCoord(29, 11)] : true,
            [utils.asGridCoord(30, 11)] : true,
            [utils.asGridCoord(3, 12)] : true,
            [utils.asGridCoord(30, 12)] : true,
            [utils.asGridCoord(3, 13)] : true,
            [utils.asGridCoord(29, 13)] : true,
            [utils.asGridCoord(3, 14)] : true,
            [utils.asGridCoord(4, 14)] : true,
            [utils.asGridCoord(5, 14)] : true,
            [utils.asGridCoord(6, 14)] : true,
            [utils.asGridCoord(7, 14)] : true,
            [utils.asGridCoord(8, 14)] : true,
            [utils.asGridCoord(23, 14)] : true,
            [utils.asGridCoord(24, 14)] : true,
            [utils.asGridCoord(25, 14)] : true,
            [utils.asGridCoord(26, 14)] : true,
            [utils.asGridCoord(27, 14)] : true,
            [utils.asGridCoord(28, 14)] : true,
            [utils.asGridCoord(8, 15)] : true,
            [utils.asGridCoord(23, 15)] : true,
            [utils.asGridCoord(8, 16)] : true,
            [utils.asGridCoord(23, 16)] : true,
            [utils.asGridCoord(8, 17)] : true,
            [utils.asGridCoord(23, 17)] : true,
            [utils.asGridCoord(8, 18)] : true,
            [utils.asGridCoord(23, 18)] : true,
            [utils.asGridCoord(9, 19)] : true,
            [utils.asGridCoord(10, 19)] : true,
            [utils.asGridCoord(11, 19)] : true,
            [utils.asGridCoord(22, 19)] : true,
            [utils.asGridCoord(11, 20)] : true,
            [utils.asGridCoord(17, 20)] : true,
            [utils.asGridCoord(18, 20)] : true,
            [utils.asGridCoord(19, 20)] : true,
            [utils.asGridCoord(20, 20)] : true,
            [utils.asGridCoord(21, 20)] : true,
            [utils.asGridCoord(11, 21)] : true,
            [utils.asGridCoord(12, 21)] : true,
            [utils.asGridCoord(13, 21)] : true,
            [utils.asGridCoord(14, 21)] : true,
            [utils.asGridCoord(15, 21)] : true,
            [utils.asGridCoord(16, 21)] : true,
            //carrot stand
            [utils.asGridCoord(13, 16)] : true,
            [utils.asGridCoord(14, 16)] : true,
            [utils.asGridCoord(15, 16)] : true,
        },
    },
}