"use strict";

// ********** CONSTANTS *********** //

const gallery = document.querySelector(".gallery");

const dialog = document.querySelector("dialog");
const button = document.querySelector(".mes-projets button");
const showButton = document.querySelector("dialog + .mes-projets button");
const closeButton = document.querySelector("dialog button");



// ********** VARIABLES *********** //







// ********** FUNCTIONS *********** //

showButton.addEventListener("click", () => {
dialog.showModal();
dialog.classList.toggle("active")
});

closeButton.addEventListener("click", () => {
dialog.close();
dialog.classList.toggle("active")
});





// ********** MAIN *********** //




