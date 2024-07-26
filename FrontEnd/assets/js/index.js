"use strict";

// ********** CONSTANTS *********** //

const URL = "http://localhost:5678/api/";

const dialog = document.querySelector("dialog");
const editMode = document.querySelector('.mode-edition');
const editBtn = document.querySelector('.btn-modifier');
const loginBtn = document.querySelector('#login');
const logoutBtn = document.querySelector('#logout');
const button = document.querySelector(".mes-projets button");
const showButton = document.querySelector("dialog + .mes-projets button");
const closeButton = document.querySelector("dialog button");
const addButton = document.querySelector(".btn-add");
const projetsGallery = document.querySelector(".gallery");
const classFilters = document.querySelector('.filters');
const modalGallery = document.getElementById("modal-gallery");
const backButton = document.querySelector('.btn-back');
const formButton = document.querySelector("dialog form");
const addImage = document.querySelector(".modal-gallery .test");
const divBar = document.querySelector(".div-bar");
const pPhoto = document.querySelector(".modal-gallery p");

// ********** VARIABLES *********** //

let works;
let categories;

// ***************** FUNCTIONS ****************** //

/**
Ce code définit une fonction appelée fetchData qui récupère des données en fonction du type fourni. Si le type est "works", il assigne les données récupérées à la variable works, sinon à la variable categories. Il utilise l'API fetch pour faire une requête réseau et await pour gérer la réponse de manière asynchrone
* @param {string} type - The type of data to fetch.
 */
const fetchData = async (type) => {
  const response = await fetch(URL + type);

  if (type === "works") {
    works = await response.json();
  } else {
    categories = await response.json();
  }
}

// ********* AFFICHAGE PROJETS  ********* //

const generateWorks = () => {
  projetsGallery.innerHTML = ''; // Clear existing works

  for (let i = 0; i < works.length; i++) {
    const figure = works[i];

    const galleryElement = document.createElement("figure");
    const titleProjet = document.createElement("figcaption");
    const imageProjet = document.createElement("img");

    titleProjet.innerText = figure.title;
    imageProjet.src = figure.imageUrl;

    projetsGallery.appendChild(galleryElement)
    galleryElement.appendChild(imageProjet)
    galleryElement.appendChild(titleProjet)
  }
}

// ********* AFFICHAGE CATEGORIE ******** //

const generateCategories = () => {
  const allButton = document.createElement('button');

  allButton.innerText = "Tous";
  allButton.classList.add("btn-filters");

  allButton.addEventListener('click', () => {
    generateWorks(works);
  });

  classFilters.appendChild(allButton);

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    const btnFiltrer = document.createElement('button');

    btnFiltrer.innerText = category.name;
    btnFiltrer.classList.add("btn-filters");

    // Add event listener to filter buttons
    btnFiltrer.addEventListener('click', () => {
      filterWorks(category.id);
    });

    classFilters.appendChild(btnFiltrer);
  }
}
/**
 * Filtre les œuvres en fonction de l'ID de catégorie donné et génère les œuvres filtrées.
 *
 * @param {number} categoryId - L'ID de la catégorie pour filtrer les œuvres.
 */
const filterWorks = (categoryId) => {
  const filteredWorks = works.filter(work => work.categoryId === categoryId);
  generateWorks(filteredWorks);
}

// ******** LOGIN - LOGOUT  ******** //

const displayAdmin = () => {
  if (localStorage.getItem("token")) {
    editMode.classList.remove("hide");
    editBtn.classList.remove("hide");
    classFilters.classList.add("hide");

    loginBtn.classList.add("hide");
    logoutBtn.classList.remove("hide");
  } else {
    editMode.classList.add("hide");
    editBtn.classList.add("hide");
    classFilters.classList.remove("hide");

    loginBtn.classList.remove("hide");
    logoutBtn.classList.add("hide");
  }
};

const logout = () => {
  localStorage.removeItem("token");
  displayAdmin()
  location.reload()
}

logoutBtn.addEventListener("click", logout);

// ******** MODALS ********* //

/**
 * Toggles the visibility of a modal dialog.
 */
const toggleModal = () => {
  showButton.addEventListener("click", () => {
    dialog.showModal();
    dialog.classList.toggle("active");
    generateModalGallery();
  });

  closeButton.addEventListener("click", () => {
    dialog.close();
    dialog.classList.toggle("active");
  });
}

const generateModalGallery = () => {
  modalGallery.innerHTML = ''; // Clear existing works

  for (let i = 0; i < works.length; i++) {
    const figure = works[i];

    const galleryElement = document.createElement("figure");
    galleryElement.classList.add("gallery-item");
    galleryElement.innerHTML = `<img src="${figure.imageUrl}" alt="${figure.title}"> 
    <button class="btn-delete" data-id="${figure.id}"><i class="fa-solid fa-trash-can"></i></button>`;

    modalGallery.appendChild(galleryElement);

    galleryElement.querySelector('.btn-delete').addEventListener('click', () => {
      deleteWork(figure.id);

    });
  }
  document.querySelector(".btn-add").addEventListener("click", generateModalForm);
}
/**
+ * Supprime de manière asynchrone un travail en fonction de son ID.
+ *
+ * @param {number} id - L'ID du travail à supprimer.
+ */
const deleteWork = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vous devez être connecté pour supprimer un projet.");
    return;
  }

  const response = await fetch(URL + 'works/' + id, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    works = works.filter(work => work.id !== id);
    generateWorks();
    generateModalGallery();
  } else {
    alert("Erreur lors de la suppression du travail.");
  }
}

const generateModalForm = () => {
  modalGallery.innerHTML = '';

  document.querySelector(".modal-gallery h2").innerText = "Ajout photo";
  backButton.classList.remove("hide");
  formButton.classList.remove("hide");
  addButton.classList.add("active");
  divBar.classList.add("active");
  pPhoto.classList.remove("hide");
  
  document.querySelector(".btn-add").innerText = "Valider";

  const titlePhoto = document.createElement("h2")
  modalGallery.appendChild(titlePhoto);

  backButton.addEventListener("click", () => {
    generateModalGallery();
    formButton.classList.add("hide");
    document.querySelector(".btn-add").innerText = "Ajouter une photo";
    addButton.classList.remove("active");
    divBar.classList.remove("active");


    document.querySelector(".modal-gallery h2").innerText = "Gallerie photo";
    backButton.classList.add("hide");
  })
}

const addProject = async (event) => {
  event.preventDefault(); // Empêcher le rechargement de la page

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vous devez être connecté pour ajouter un projet.");
    return;
  }

  // Récupérer les valeurs des champs du formulaire
  const title = document.getElementById('titre').value;
  const category = document.getElementById('categories').value;
  const image = document.querySelector('input[type="file"]').files[0];

  // Créer un objet FormData pour envoyer les données
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('image', image);

  // Envoyer les données au serveur
  const response = await fetch(URL + 'works/' + id, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (response.ok) {
    const newWork = await response.json();
    works.push(newWork); // Ajouter le nouveau projet à la liste
    generateWorks(); // Mettre à jour la galerie de projets
    generateModalGallery(); // Mettre à jour la galerie de la modal
    alert("Projet ajouté avec succès.");
  } else {
    alert("Erreur lors de l'ajout du projet.");
  }
};

// Attacher l'événement au bouton "Ajouter une photo"
document.querySelector('.btn-add').addEventListener('click', () => {
  document.querySelector('form').classList.toggle('hide');
});

addButton.addEventListener('submit', addProject);


const init = async () => {
  await fetchData("categories");
  await fetchData("works");

  generateWorks();
  generateCategories();
  displayAdmin()
  toggleModal();
}


// ********** MAIN *********** //

init();
