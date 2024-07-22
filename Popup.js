const popupNames = ["intro", "charas"];
var popups = [];

introPopup = document.getElementById("p-" + "intro");
introOpen = document.getElementById("btn-" + "intro");
introClose = document.getElementById("btn-" + "intro" + "-close");

dragElement(introPopup);
introOpen.onclick = function() {openElement(introPopup);}
introClose.onclick = function() {closeElement(introPopup);}

charasPopup = document.getElementById("p-" + "charas");
charasOpen = document.getElementById("btn-" + "charas");
charasClose = document.getElementById("btn-" + "charas" + "-close");

dragElement(charasPopup);
charasOpen.onclick = function() {openElement(charasPopup);}
charasClose.onclick = function() {closeElement(charasPopup);}



// // while (true){
// var i = 0; 
// popupNames.forEach(name => {
//   thisPopup = []; 
//   thisPopup[0] = document.getElementById("p-" + name);
//   thisPopup[1] = document.getElementById("btn-" + name);
//   thisPopup[2] = document.getElementById("btn-" + name + "-close");
//   popups[i] = thisPopup;
  
//   dragElement(popups[i][0]);
//   popups[i][1].onclick = function() {openElement(popups[i][0]);}
//   popups[i][2].onclick = function() {closeElement(popups[i][0]);}

//   i = i + 1;

//   // thisPopup = document.getElementById("p-" + name);
//   // btnOpen = document.getElementById("btn-" + name);
//   // btnClose = document.getElementById("btn-" + name + "-close");

//   // dragElement(thisPopup);
//   // btnOpen.onclick = function() {openElement(thisPopup);}
//   // btnClose.onclick = function() {closeElement(thisPopup);}
// });  
// // }

function openElement(target){target.style.display = "block";}
function closeElement(target){target.style.display = "none";}

function dragElement(popup) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(popup.id + "-topbar")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(popup.id + "-topbar").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    popup.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || popup.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || popup.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    popup.style.top = (popup.offsetTop - pos2) + "px";
    popup.style.left = (popup.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    const width = document.getElementById(popup.id).offsetWidth;
    const height = document.getElementById(popup.id).offsetHeight;
    const right = popup.offsetLeft + width;
    const bottom = popup.offsetTop + height;

    if(popup.offsetTop < 0) popup.style.top = "-20px";
    if(popup.offsetLeft < 45 - width) popup.style.left = 45 - width + "px";
    if(right > window.innerWidth + width - 13) popup.style.left = (window.innerWidth - 13) + "px";
    if(bottom > window.innerHeight + height - 13) popup.style.top = (window.innerHeight - 13) + "px";
  }
}