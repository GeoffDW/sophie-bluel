"use strict";

// ********** CONSTANTS *********** //

const BASE_URL = "http://localhost:5678/api/";
const WORKS_URL = BASE_URL + "works";

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
const faImage = document.querySelector("form i")
const divForm = document.querySelector("form div");
const btnImage = document.querySelector(".btnImage")
const image = document.getElementById("previewImage");



// ********** VARIABLES *********** //

let works;
let categories;

// ***************** FUNCTIONS ****************** //

/**
Ce code définit une fonction appelée fetchData qui récupère des données en fonction du type fourni. Si le type est "works", il assigne les données récupérées à la variable works, sinon à la variable categories. Il utilise l'API fetch pour faire une requête réseau et await pour gérer la réponse de manière asynchrone
* @param {string} type - The type of data to fetch.
 */
const fetchData = async (type) => {
  const response = await fetch(BASE_URL + type);

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
  addButton.addEventListener("click", generateModalForm);
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

  const response = await fetch(WORKS_URL + id, {
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

  const submitButton = addButton;

  document.querySelector(".modal-gallery h2").innerText = "Ajout photo";
  backButton.classList.remove("hide");
  formButton.classList.remove("hide");
  submitButton.classList.add("active");
  divBar.classList.add("active");
  pPhoto.classList.remove("hide");
  
  submitButton.innerText = "Valider";

  const titlePhoto = document.createElement("h2")
  modalGallery.appendChild(titlePhoto);

  backButton.addEventListener("click", () => {
    generateModalGallery();
    formButton.classList.add("hide");
    submitButton.innerText = "Ajouter une photo";
    submitButton.classList.remove("active");
    divBar.classList.remove("active");


    document.querySelector(".modal-gallery h2").innerText = "Gallerie photo";
    backButton.classList.add("hide");
  })

document.getElementById("imageInput").addEventListener('change', previewImage)

  // Événement pour envoyer les données lorsque le bouton "Ajouter une photo" est cliqué
submitButton.addEventListener('click', (event) => {
  event.preventDefault(); // Empêche le rechargement de la page
  sendFormData();
});
}

function previewImage(e) {
  const submitButton = addButton;
  const input = e.target;

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
        image.src = e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
  }

  divForm.classList.remove("hide");
  btnImage.classList.add("hideTwo");
  submitButton.classList.add("active");
  submitButton.classList.add("btnGreen");
}

const fileInput = document.getElementById('image');
const previewContainer = document.getElementById('image-preview-container');
const uploadForm = document.getElementById('upload-form');

// Fonction pour envoyer les données

async function sendFormData() {
  const formData = new FormData();
  formData.append('image', fileInput.files[0]);
  formData.append('titre', document.getElementById('titre').value);
  formData.append('categories', document.getElementById('categories').value);

  const token = localStorage.getItem('token'); // Récupère le token depuis le local storage
  console.log(typeof fileInput.files[0], fileInput.files[0])
  console.log(typeof document.getElementById('titre').value, document.getElementById('titre').value)

  console.log(typeof document.getElementById('categories').value, document.getElementById('categories').value)
  console.log(typeof token, token)

  try {
    const response = await fetch(WORKS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
      method: 'POST',
      body: formData
      
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la requête: ' + response.status);
    }

    const data = await response.json();
    console.log('Réponse de l\'API :', data);

    // Ajouter l'image à la galerie
    const newImage = document.createElement('img');
    newImage.src = BASE_URL.createObjectURL(fileInput.files[0]);
    newImage.alt = document.getElementById('titre').value;

    modalGallery.appendChild(newImage);

    // Réinitialiser le formulaire après l'ajout
    // uploadForm.reset();
    image.src = '';
    previewContainer.classList.add('hide');

  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire :', error);
  }
}


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
