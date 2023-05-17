// Selecting required elements from the DOM
const containerEl = document.querySelector(".container");
const searchInputEl = containerEl.querySelector("input");
const speak = containerEl.querySelector(".word i");
const infoTextEl = containerEl.querySelector(".info-text");
const synonymsEl = containerEl.querySelector(".synonyms .list");
const removeIcon = containerEl.querySelector(".search span");
let audio;

// Event listener for keyup event on the search input field
searchInputEl.addEventListener("keyup", e => {
    let word = e.target.value;
    // Check if the Enter key is pressed and there is a word to search
    if (e.key == "Enter" && word) {
        fetchApi(word);
    }
});

// Function to fetch data from the API
function fetchApi(word) {
    // Resetting the UI
    containerEl.classList.remove("active");
    infoTextEl.style.color = "black";
    infoTextEl.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    // This API URL fetches the word meaning
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.title) {
                    infoTextEl.innerHTML = `Unable to find the meaning of the word <span>"${word}"</span>. Please, Search for another word.`;
                } else {
                    containerEl.classList.add("active");

                    // Extracting required information from the fetched data
                    let definitions = data[0].meanings[0].definitions[0];
                    let phonetics = `${data[0].meanings[0].partOfSpeech}  /${data[0].phonetics[0].text}/`;

                    // This block updates the UI with the fetched information fom the dictonary api
                    document.querySelector(".word p").innerText = `Word : ${data[0].word}`;
                    document.querySelector(".word span").innerText = phonetics;
                    document.querySelector(".meaning span").innerText = definitions.definition;
                    document.querySelector(".source span").innerHTML = `<a href="${data[0].sourceUrls[0]}" target="_blank">${data[0].sourceUrls[0]}</a>`;
                    audio = new Audio(data[0].phonetics[0].audio);

                    // Checking if synonyms are available and updating the UI
                    if (data[0].meanings[0].synonyms[0] === undefined) {
                        synonymsEl.innerHTML = "NA";
                    } else {
                        synonymsEl.innerHTML = "";
                        for (let i = 0; i < 5; i++) {
                            let tag = `<span>${data[0].meanings[0].synonyms[i]},</span>`;
                            synonymsEl.insertAdjacentHTML("beforeend", tag);
                        }
                    }
                }
            });
    } catch {
        infoTextEl.innerHTML = `Unable to find the meaning of the word <span>"${word}"</span>. Please, Search for another word.`;
    }
}

// This event listener is for the speak button
speak.addEventListener("click", () => {
    speak.style.color = "red";
    audio.play();
    setTimeout(() => {
        speak.style.color = "gray";
    }, 800);
});

// This event listener for the remove icon clears the input field
removeIcon.addEventListener("click", () => {
    searchInputEl.value = "";
    searchInputEl.focus();
    containerEl.classList.remove("active");
    infoTextEl.style.color = "black";
    infoTextEl.innerHTML = "Type a word & click 'ENTER' to get the results.";
});

//This script performs the following tasks:

//It selects various elements from the DOM using document.querySelector and assigns them to variables.
//It adds an event listener to the search input field for the keyup event to capture the entered word when the Enter key is pressed.
//The fetchApi function is responsible for fetching data from the API using the entered word.
//Inside the fetchApi function, it updates the UI to show a loading message and sends a request to the dictionary API to retrieve the meaning of the word.
//If the API returns a valid response, it updates the UI with the word's information, such as definitions, phonetics, synonyms, and source URLs.
//If the API does not find a meaning for the word, it updates the UI to show an error message.
//There is an event listener for the volume button, which plays the audio pronunciation of the word when clicked.
//There is an event listener for the remove icon, which clears the search input field, resets the UI, and provides an initial instruction message.
