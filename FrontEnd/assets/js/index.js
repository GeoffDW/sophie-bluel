"use strict";

// ********** CONSTANTS *********** //

const URL = "http://localhost:5678/api/";

const gallery = document.querySelector(".gallery");
const dialog = document.querySelector("dialog");
const button = document.querySelector(".mes-projets button");
const showButton = document.querySelector("dialog + .mes-projets button");
const closeButton = document.querySelector("dialog button");




// ********** VARIABLES *********** //

let works;
let categories;



// ********** FUNCTIONS *********** //


/**
 * Fetches data based on the type provided and assigns it to either works or categories.
 *
 * @param {string} type - The type of data to fetch.
 */
const fetchData = async (type) => {
  const response = await fetch(URL + type);

  type === "works" ? 
  works = await response.json() : 
  categories = await response.json();

  console.log(typeof works, works);
  console.log(typeof categories, categories);
}

/**
 * Toggles the visibility of a modal dialog.
 */
const toggleModal = () => {

  showButton.addEventListener("click", () => {
    dialog.showModal();
    dialog.classList.toggle("active");
  });

  closeButton.addEventListener("click", () => {
    dialog.close();
    dialog.classList.toggle("active");
  });
}


// ********** MAIN *********** //

fetchData("categories");
fetchData("works");
toggleModal();



