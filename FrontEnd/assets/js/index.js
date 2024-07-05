"use strict";

// ********** CONSTANTS *********** //

const URL = "http://localhost:5678/api/";

const dialog = document.querySelector("dialog");
const button = document.querySelector(".mes-projets button");
const showButton = document.querySelector("dialog + .mes-projets button");
const closeButton = document.querySelector("dialog button");
const projetsGallery = document.querySelector(".gallery");
const classFiltre = document.querySelector('.filters')

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

  if (type === "works") {
    works = await response.json();
  } else {
    categories = await response.json();
  }

  console.log(typeof works, works);
  console.log(typeof categories, categories);
}

// Affichage projets //

function genererWorks(works) {
  projetsGallery.innerHTML = ''; // Clear existing works
  for (let i = 0; i < works.length; i++) {
    const figure = works[i];

    const galleryElement = document.createElement("figure");

    const titleProjet = document.createElement("figcaption");
    titleProjet.innerText = figure.title;

    const imageProjet = document.createElement("img");
    imageProjet.src = figure.imageUrl;

    projetsGallery.appendChild(galleryElement)
    galleryElement.appendChild(imageProjet)
    galleryElement.appendChild(titleProjet)
  }
}

// Affichage categories //

function genererCategories(categories) {
  const allButton = document.createElement('button');
  allButton.innerText = "Tous";
  allButton.classList.add("btn-filters");
  allButton.addEventListener('click', () => {
    genererWorks(works); // Show all works
  });
  classFiltre.appendChild(allButton);

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    const btnFiltrer = document.createElement('button');
    btnFiltrer.innerText = category.name;
    btnFiltrer.classList.add("btn-filters");

    // Add event listener to filter buttons
    btnFiltrer.addEventListener('click', () => {
      filterWorks(category.id);
    });

    classFiltre.appendChild(btnFiltrer);
  }
}

// Filtrer les projets par catégorie
function filterWorks(categoryId) {
  const filteredWorks = works.filter(work => work.categoryId === categoryId);
  genererWorks(filteredWorks);
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

const init = async () => {
  await fetchData("categories");
  await fetchData("works");
  genererWorks(works);
  genererCategories(categories);
  toggleModal();
}

init();
