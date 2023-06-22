const quizList = document.getElementById('quiz-list');
var registeredQuizIds = [];
var registeredQuestionIds = {};
var activeQuizId = "";
var oldQuestionId = "";


function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

function createQuizOptionBtn(quizId, btnId, fontClass, aTagUrl, messageId, messageContent){
    const btn = document.createElement('button');
    btn.id = btnId;
    const icon = document.createElement('i');
    icon.classList.add('fas',fontClass);
    btn.appendChild(icon);

    const message = document.createElement('div');
    message.id = messageId;
    message.textContent = messageContent;

    const aTag = document.createElement('a');
    aTag.href = aTagUrl;
    aTag.appendChild(btn);
    aTag.append(message);

    if (btnId == 'btn-delete') {
        btn.addEventListener('click', function() {
            deletePopup.style.display = 'block';
            activeQuizId = quizId;
        });
        aTag.addEventListener('click', function(event) {
            event.preventDefault();
        });
    } else if (btnId == 'btn-add') {
        btn.addEventListener('click', function() {
            addQuestionPopup.style.display = 'block';
            document.getElementById('quiz-id').defaultValue = quizId;
            activeQuizId = quizId;
        });
        aTag.addEventListener('click', function(event) {
            event.preventDefault();
        });
    }

    const tempDiv = document.createElement('div');
    tempDiv.classList.add('quiz-btn-container');
    tempDiv.appendChild(aTag);

    return tempDiv
}

function renderQuizItem(quiz) {
    const quizItem = document.createElement('div');
    quizItem.classList.add('quiz-item');

    const quizId = document.createElement('div');
    quizId.classList.add('quiz-title');

    const quizTitle = document.createElement('h6');
    quizTitle.textContent = quiz.quizId;

    quizId.appendChild(quizTitle);

    const quizOptions = document.createElement('div');
    quizOptions.classList.add('quiz-options');

    const previewBtn = createQuizOptionBtn(quiz.quizId, 'btn-preview', 'fa-eye', `/quiz/preview-quiz/${quiz.quizId}` ,'message-preview', 'Preview Quiz');
    const addQuestionBtn = createQuizOptionBtn(quiz.quizId, 'btn-add', 'fa-plus', '#' ,'message-add', 'Add Question');
    const createAnswerKeyBtn = createQuizOptionBtn(quiz.quizId,'btn-answerkey', 'fa-key', '#' ,'message-answerkey', 'Create/Update Answer Key');
    const deleteQuizBtn = createQuizOptionBtn(quiz.quizId, 'btn-delete', 'fa-trash', '#' ,'message-delete', 'Delete Quiz');

    const timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    timestamp.textContent = `Last Updated: ${quiz.updated_at}`;

    quizOptions.appendChild(previewBtn);
    quizOptions.appendChild(addQuestionBtn);
    quizOptions.appendChild(createAnswerKeyBtn);
    quizOptions.appendChild(deleteQuizBtn);
    quizOptions.appendChild(timestamp);

    quizItem.appendChild(quizId);
    quizItem.appendChild(quizOptions);

    quizList.appendChild(quizItem);
}


document.addEventListener('DOMContentLoaded', function() {
    const csrftoken = getCookie('csrftoken');
    fetch(quizHistoryUrl, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Error in Getting the Quizzes!');
        }
        return response.json();
    })
    .then(data => {
        registeredQuizIds = data.quizIds;
        registeredQuestionIds = data.questionIds;
        data.quizzes.forEach(quiz => {
            renderQuizItem(quiz);
        });
    })
    .catch(error => {
        console.error('Error fetching quiz history!', error);
    });
});








const createQuizBtn = document.getElementById('create-quiz-btn');
const quizPopup = document.getElementById('quiz-popup');
const quizForm = document.getElementById('quiz-form');
const quizIdInput = document.getElementById('quiz-id-input');
const quizIdStatus = document.getElementById('quiz-id-status');
const quizIdStatusIcon = quizIdStatus.querySelector('i');
const cancelBtn = document.getElementById('cancel-btn');


createQuizBtn.addEventListener('click', function() {
    quizPopup.style.display = 'block';
});

cancelBtn.addEventListener('click', () => {
    quizPopup.style.display = 'none';
    quizForm.reset();
});

window.addEventListener('click', (event) => {
    if (event.target === quizPopup) {
        quizPopup.style.display = 'none';
        quizForm.reset();
    }
    if (event.target === deletePopup) {
        deletePopup.style.display = 'none';
        deleteForm.reset();
    }
    if (event.target === addQuestionPopup) {
        window.location.href = thisPage;
    }
});


quizIdInput.addEventListener('input', function() {
  const quizId = quizIdInput.value;
  
  if (quizId === '') {
    quizIdStatusIcon.classList.remove('fa-check');
    quizIdStatusIcon.classList.add('fa-times');
    quizIdStatus.title = 'Invalid Quiz ID!';
  } else if (registeredQuizIds.includes(quizId)){
    quizIdStatusIcon.classList.remove('fa-check');
    quizIdStatusIcon.classList.add('fa-times');
    quizIdStatus.title = 'Quiz ID already exists!';
  } else {
    quizIdStatusIcon.classList.remove('fa-times');
    quizIdStatusIcon.classList.add('fa-check');
    quizIdStatus.title = 'Quiz ID is available!';
  }
});

function addQuizIdToBackend(quizId) {
    const csrftoken = getCookie('csrftoken');
    fetch(createNewQuizUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            quizId : quizId,
        }),
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Error in saving the question!');
        }
        return response.json();
    })
    .then(data => {
        window.location.href = thisPage;
    })
    .catch(error => {
        console.error('Error in Creating New Quiz!', error);
    });
}


quizForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const quizId = quizIdInput.value;

  if (!registeredQuizIds.includes(quizId)) {
    addQuizIdToBackend(quizId);
  }
});




const deletePopup = document.getElementById('delete-popup');
const deleteForm = document.getElementById('delete-form');
const confirmDeleteCheckbox = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');


function deleteQuizIdToBackend(quizId) {
    const csrftoken = getCookie('csrftoken');
    fetch(deleteQuizUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            quizId : quizId,
        }),
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Error in deleting the quiz!');
        }
        return response.json();
    })
    .then(data => {
        window.location.href = thisPage;
    })
    .catch(error => {
        console.error('Error in deleting the Quiz!', error);
    });
}

deleteForm.addEventListener('submit', function(event) {
  event.preventDefault();
  if (confirmDeleteCheckbox.checked) {
    deleteQuizIdToBackend(activeQuizId);
  }
});

cancelDeleteBtn.addEventListener('click', function(event) {
    deletePopup.style.display = 'none';
    deleteForm.reset();
});



const addQuestionPopup = document.getElementById('add-question-popup');
const cancelAddQuestionBtn = document.getElementById('cancel-add-question');

cancelAddQuestionBtn.addEventListener('click', function(event) {
    window.location.href = thisPage;
});