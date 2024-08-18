"use strict";

// ********** CONSTANTS *********** //

const BASE_URL = "http://localhost:5678/api/";
const WORKS_URL = BASE_URL + "works/";

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

const generateWorks = (works) => {
  projetsGallery.innerHTML = '';

  console.log(works)
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
function filterWorks(categoryId) {
  const filteredWorks = works.filter(work => work.categoryId === categoryId);
  console.log(filteredWorks)
  generateWorks(filteredWorks);
}

// ******** LOGIN - LOGOUT  ******** //
/**
 * Affiche ou masque les éléments liés à l'administration en fonction de la présence d'un jeton dans le stockage local.
 *
 */
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

/**
 * Déconnecte l'utilisateur en supprimant le jeton de stockage local,
 * mettant à jour l'état displayAdmin, et rechargeant la page.
 *
 */
const logout = () => {
  localStorage.removeItem("token");
  displayAdmin()
  location.reload()
}

logoutBtn.addEventListener("click", logout);


// ******** MODALS ********* //


/**
 * Bascule la visibilité d'une boîte de dialogue modale.
 *
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


/**
+ * Génère la galerie modale en effaçant les œuvres existantes et en ajoutant de nouvelles éléments de galerie
+ * pour chaque œuvre dans le tableau works. Chaque élément de galerie contient une image et un bouton de suppression.
+ * En cliquant sur le bouton de suppression, la fonction deleteWork est déclenchée avec l'identifiant correspondant de l'œuvre.
+ * Enfin, ajoute un écouteur d'événement de clic à l'élément addButton pour déclencher la fonction generateModalForm.
+ *
+ */
const generateModalGallery = () => {
  modalGallery.innerHTML = '';

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
    generateWorks(works);
    generateModalGallery();
  } else {
    alert("Erreur lors de la suppression du travail.");
  }
}


/**
 * Génère un formulaire modal pour ajouter une photo.
 *
 */
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

  submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    sendFormData();
  });
}


/**
 * Affiche une image sélectionnée par l'utilisateur.
 *
 * @param {Event} e - L'objet d'événement représentant l'événement de changement de fichier.
 */
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
}

const fileInput = document.getElementById('image');
const previewContainer = document.getElementById('image-preview-container');
const uploadForm = document.getElementById('imageInput');



document.addEventListener('DOMContentLoaded', () => {
  const titreInput = document.getElementById('titre');
  const categorieSelect = document.getElementById('categories');
  const validateBtn = addButton;


  /**
   * Met à jour l'état du bouton en fonction des champs d'entrée.
   *
   */
  const updateButtonState = () => {
    const isTitreFilled = titreInput.value.trim() !== '';

    const isCategorieSelected = categorieSelect.value !== '0';

    if (isTitreFilled && isCategorieSelected) {
      validateBtn.classList.add('btnGreen');
    } else {
      validateBtn.classList.remove('btnGreen');
    }
  }

  titreInput.addEventListener('input', updateButtonState);
  categorieSelect.addEventListener('change', updateButtonState);
});


/**
 * Envoie les données du formulaire au serveur pour créer une nouvelle œuvre.
 *
 */
const sendFormData = () => {
  const formData = new FormData();

  formData.append("title", document.getElementById('titre').value);
  formData.append("category", document.getElementById('categories').value);
  formData.append("image", fileInput.files[0]);

  const token = localStorage.getItem("token");

  console.log(typeof formData.get("category"), formData.get("category"));
  if (formData.get("title") && formData.get("category") !== "0" && formData.get("image") && token) {

  fetch(WORKS_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  })

    .then(async (response) => {
      if (response.ok) {
        const newWork = await response.json();
        works.push(newWork);
        console.log(works)
        // generateWorks(works);
      }
    })

    .catch((error) => {
      console.error(error);
    });
  }
};



/**
 * Ajoute une nouvelle image à la galerie avec le titre fourni.
 *
 * @param {object} fileInput - L'élément d'entrée contenant le fichier image.
 * @param {string} title - Le titre à afficher pour l'image.
 */
function addImageToGallery(fileInput, title) {
  const newFigure = document.createElement('figure');

  const newImage = document.createElement('img');
  newImage.src = BASE_URL.createObjectURL(fileInput.files[0]);
  newImage.alt = title;

  const newFigcaption = document.createElement('figcaption');
  newFigcaption.textContent = title;

  newFigure.appendChild(newImage);
  newFigure.appendChild(newFigcaption);

  modalGallery.appendChild(newFigure);
}


/**
 * Initialise l'application en récupérant les données, en générant les travaux et les catégories,
 * et en activant la modale.
 *
 */
const init = async () => {
  await fetchData("categories");
  await fetchData("works");

  generateWorks(works);
  generateCategories();
  displayAdmin()
  toggleModal();
}


// ********** MAIN *********** //

init();
