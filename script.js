// Configuration Firebase (remplace par tes propres clés)
const firebaseConfig = {
    apiKey: "AIzaSyCEF2JakmJ_bE-jk3aislgYPMb3YpdqSjs",
    authDomain: "projet-2-web-13f30.firebaseapp.com",
    projectId: "projet-2-web-13f30",
    storageBucket: "projet-2-web-13f30.appspot.com",
    messagingSenderId: "1090784527322",
    appId: "1:1090784527322:web:2ad642de202bea093ff6e3"
};

// Initialise Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Références aux services Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Éléments du DOM
const authSection = document.getElementById("auth");
const imageSection = document.getElementById("image-section");
const postSection = document.getElementById("post-section");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupButton = document.getElementById("signup");
const signinButton = document.getElementById("signin");
const errorMessage = document.getElementById("error-message");
const logoutButton = document.getElementById("logout");
const imagesContainer = document.getElementById("images");
const questionInput = document.getElementById("question");
const postQuestionButton = document.getElementById("post-question");

// Vérifie l'état de connexion
auth.onAuthStateChanged((user) => {
    if (user) {
        // Si l'utilisateur est connecté
        authSection.classList.add("hidden"); // Cache la section de connexion
        imageSection.classList.remove("hidden"); // Affiche la section des images
        postSection.classList.remove("hidden"); // Affiche la section pour poster des questions
        fetchAndDisplayImages(); // Charge et affiche les images
    } else {
        // Si l'utilisateur est déconnecté
        authSection.classList.remove("hidden"); // Affiche la section de connexion
        imageSection.classList.add("hidden"); // Cache la section des images
        postSection.classList.add("hidden"); // Cache la section pour poster des questions
    }
});

// Gestion de l'inscription
signupButton.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Utilisateur inscrit :", userCredential.user);
        })
        .catch((error) => {
            console.error("Erreur d'inscription :", error);
            errorMessage.textContent = error.message;
        });
});

// Gestion de la connexion
signinButton.addEventListener("click", () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Utilisateur connecté :", userCredential.user);
        })
        .catch((error) => {
            console.error("Erreur de connexion :", error);
            errorMessage.textContent = error.message;
        });
});

// Gestion de la déconnexion
logoutButton.addEventListener("click", () => {
    auth.signOut()
        .then(() => {
            console.log("Utilisateur déconnecté");
        })
        .catch((error) => {
            console.error("Erreur de déconnexion :", error);
            alert("Erreur de déconnexion : " + error.message);
        });
});

// Fonction pour récupérer et afficher des images éducatives depuis Pexels
const fetchAndDisplayImages = async () => {
    const apiKey = "E7vKT5o1I4nSawB2AWERhNm4QsQo7zLsCtGixWjYzXMOT5Ke9Ic0S8Ei"; // Remplace par ta clé API Pexels
    const query = "education"; // Mot-clé pour les images éducatives
    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${query}&per_page=10`, // 10 images par page
            {
                headers: {
                    Authorization: apiKey, // Utilise ta clé API Pexels
                },
            }
        );
        const data = await response.json();
        console.log("Réponse de l'API Pexels :", data); // Affiche la réponse de l'API
        imagesContainer.innerHTML = ""; // Vide le conteneur d'images
        data.photos.forEach((image) => {
            const imgElement = document.createElement("img");
            imgElement.src = image.src.medium; // Utilise la version moyenne de l'image
            imgElement.alt = image.photographer || "Image éducative"; // Texte alternatif
            imagesContainer.appendChild(imgElement);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des images :", error);
    }
};

// Gestion de la publication de questions
postQuestionButton.addEventListener("click", () => {
    const questionText = questionInput.value;
    if (!questionText) {
        alert("Veuillez écrire une question.");
        return;
    }

    db.collection("questions").add({
        text: questionText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
        alert("Question postée !");
        questionInput.value = ""; // Vide le champ de texte
    }).catch((error) => {
        console.error("Erreur :", error);
        alert("Erreur : " + error.message);
    });
});