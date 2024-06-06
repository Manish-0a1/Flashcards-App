//Selecting DOM elements
const container = document.querySelector(".container");
const addQuestionModal = document.getElementById("add-card-modal");
const saveBtn = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-card");
const closeBtn = document.getElementById("close-btn");

//Initializing variables
let editBool = false;
let orignalId = null;
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

addQuestion.addEventListener("click", () => {
  //show the add question card and hide the container
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionModal.classList.remove("hide");
});

closeBtn.addEventListener("click", () => {
  //close the add question modal and show the container
  container.classList.remove("hide");
  addQuestionModal.classList.add("hide");
  if (editBool) {
    editBool = false;
  }
});

saveBtn.addEventListener("click", () => {
  //save the flashcard
  let tempQuestion = question.value.trim();
  let tempAnswer = answer.value.trim();
  if (!tempQuestion || !tempAnswer) {
    //Display error if Question or answer is empty
    errorMessage.classList.remove("hide");
  } else {
    if (editBool) {
      //If editing an exsisting flashcard, remove the orignal flashcard from array
      flashcards = flashcards.filter(flashcard => flashcard.id !== orignalId);
    }
    let id = Date.now();
    //Add the new flashcard to the array
    flashcards.push({ id, question: tempQuestion, answer: tempAnswer });
    //save the flashcards array to the localstorage
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    container.classList.remove("hide");
    errorMessage.classList.add("hide");
    viewList();
    question.value = "";
    answer.value = "";
    editBool = false;
    addQuestionModal.classList.add("hide"); // This line hides the modal after the flashcard is added
  }
});

//function to display the flashcards list


 function viewList() {
  const cardsList = document.querySelector(".cards-list");
  cardsList.innerHTML = '';
  flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
  flashcards.forEach(flashcard => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <p class="question-div">${flashcard.question}</p>
            <p class="answer-div hide">${flashcard.answer}</p>
            <button class="show-hide-btn">Show/hide</button>
            <div class="btns-con">
              <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="delete"><i class="fa-solid fa-trash"></i></button>
            </div>
    `;

    div.setAttribute('data-id', flashcard.id);
    const displayAnswer = div.querySelector(".answer-div");
    const showHideBtn = div.querySelector(".show-hide-btn");
    const editBtn = div.querySelector(".edit");
    const deleteButton = div.querySelector(".delete");

    showHideBtn.addEventListener("click", () => {
      //Toggle the visiblity of the answer
      displayAnswer.classList.toggle("hide");
    });

    editBtn.addEventListener("click", () => {
      //Enable editing mode and show the question card
      editBool = true;
      modifyElement(editBtn, true);
      addQuestionModal.classList.remove("hide");
    });

    deleteButton.addEventListener("click", () => {
      //Delete the flashcard
      modifyElement(deleteButton);
    });
    cardsList.appendChild(div);
  });
} 

//Function to modify the flashcard element
const modifyElement = (element, edit = false) => {
  const parentDiv = element.parentElement.parentElement;
  const id = Number(parentDiv.getAttribute("data-id"));
  const parentQuestion = parentDiv.querySelector(".question-div").innerText;
  if (edit) {
    const parentAnswer = parentDiv.querySelector(".question-div").innerText;
    answer.value = parentAnswer;
    question.value = parentQuestion;
    orignalId = id;
    disableBtns(true);
  } else {
    //remove the flash cards from array and update the localstorage
    flashcards = flashcards.filter(flashcard => flashcard.id !== id);
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }
  parentDiv.remove();
};

//Function to disable Edit btn
const disableBtns = (value) => {
  const editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = value;
  });
};

//Event Listner to dispaly the flashcards list when the Dom is loaded
document.addEventListener("DOMContentLoaded", viewList);
