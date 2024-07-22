class PopupMessage {
    constructor({ text, onComplete}) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        //create
        this.element = document.getElementById("m-intro");
        this.revealingText.init(); 

        this.element.innerHTML = (`
            <p class="TextMessage_p"></p>
            <button class="TextMessage_button">Next</button>
        `)

        this.revealingText = new RevealingText({
            element: this.element.querySelector(".TextMessage_p"),
            text: this.text
        })

        this.element.getElementById("message-next").addEventListener("click", () => {
            //close the text message
            this.done();
        });

        this.actionListener = new KeyPressListener("Enter", () => {
            this.done(); 
        })
    }  

    done() {
        if(this.revealingText.isDone){
            this.element.remove();
            this.actionListener.unbind();
            this.onComplete();
        } else {
            this.revealingText.warpToDone();
        }
    }

    // init(name) {
    //     this.createElement();
    //     document.getElementById("m-"+name).appendChild (this.element);
    //     this.revealingText.init(); 
    // }

}