"use strict"; // Evite d'écrire du code trop ancien (anterieur au ES5 2009)

// ********** CONSTANTES *********** //

const URL = "http://localhost:5678/api/users/login"; 

const email = document.querySelector('#email');
const password = document.querySelector('#password');
const submit = document.querySelector('[type="submit"]');
const error = document.querySelector('#error');

// ********** FONCTION *********** //

/**
 * Cette fonction envoie une requête POST au serveur avec l'email et le mot de passe fournis par l'utilisateur
 * dans le formulaire. Le serveur répondra avec un jeton si l'authentification a réussi, sinon il répondra avec un code de statut 401.
 * 
 * La fonction commence par créer un objet options avec la méthode de requête, les en-têtes et le corps. Le corps est l'email et le mot de passe fournis par l'utilisateur.
 * 
 * Ensuite, elle envoie la requête au serveur et affiche la réponse dans la console. 
 * 
 * Si la requête a réussi (code de statut 200), la fonction extrait le jeton de la réponse et l'enregistre dans le stockage local. Ensuite, elle redirige l'utilisateur vers la page d'accueil.
 * 
 * Si la requête a échoué, la fonction lève une erreur avec le message "Identifiant ou mot de passe incorrect" (signifiant "Identifiant ou mot de passe incorrect").
 */
const login = async () => {
    // Créer un objet options avec la méthode de requête, les en-têtes et le corps
    const options = {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    };

    console.log(options)
    // Envoyer une requête au serveur et afficher la réponse dans la console
    const response = await fetch(URL, options);
    console.log(response)

    // Si la requête a réussi, extraire le jeton de la réponse et l'enregistrer dans le stockage local
    if (response.ok) {
        const data = response.json();
        const token = data.token;
        console.log(token)

        localStorage.setItem("token", token);
        document.location.href = "index.html";

    // Si la requête a échoué, lève une erreur avec le message "Identifiant ou mot de passe incorrect"
    } else {
        throw new Error("Identifiant ou mot de passe incorrect");
    }

}

// ********** MAIN *********** //

submit.addEventListener("click", async (event) => {
    event.preventDefault();
    await login();
})