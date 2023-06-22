var activeQuestionId = "";
var tArray = []
var registeredQuestionIds = {};
var activeQuizId = quizId;
var oldQuestionId = "";
const questionContainer = document.getElementById('question-container');

document.getElementById('back-button').addEventListener('click', function() {
    window.history.back();
});

function editOptionBtn(question, btnId, fontClass, aTagUrl, messageId, messageContent){
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
            activeQuestionId = question.questionId;
        });
        aTag.addEventListener('click', function(event) {
            event.preventDefault();
        });
    } else if (btnId == 'btn-edit') {
        btn.addEventListener('click', function() {
            editQuestionPopup.style.display = 'block';
            document.getElementById('quiz-id').defaultValue = quizId;
            activeQuestionId = question.questionId;
            oldQuestionId = question.questionId;
            addDefaultValues(question);
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


function createRadioButton(questionId, value, index) {
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = `${quizId}-${questionId}`;
    radioInput.value = value;

    const radioLabel = document.createElement('label');
    radioLabel.textContent = value;

    const labelId = `${questionId}-${index}`;
    radioLabel.setAttribute('for', labelId);
    radioInput.id = labelId;

    const container = document.createElement('div');
    container.appendChild(radioInput);
    container.appendChild(radioLabel);

    return container;
}

function createTextInput(questionId, index) {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = `${quizId}-${questionId}-${index}`;

    return input;
}

function createCheckBox(questionId, value, index) {

    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.name = `${quizId}-${questionId}-${index}`;
    checkboxInput.value = value;

    const checkboxLabel = document.createElement('label');
    checkboxLabel.textContent = value;

    const labelId = `${questionId}-${index}`;
    checkboxLabel.setAttribute('for', labelId);
    checkboxInput.id = labelId;

    const container = document.createElement('div');
    container.appendChild(checkboxInput);
    container.appendChild(checkboxLabel);

    return container
}

function createDropdown(name, choices) {
    const select = document.createElement('select');
    select.name = name;

    for (let i = 0; i < choices.length; i++) {
        const optionElement = document.createElement('option');
        optionElement.value = choices[i];
        optionElement.textContent = choices[i];
        optionElement.disabled = true;

        select.appendChild(optionElement);
    }

    return select;
}

function createNumericInput(questionId, index) {
    const input = document.createElement('input');
    input.type = 'number';
    input.name = `${quizId}-${questionId}-${index}`;

    return input;
}

function createTextarea(questionId) {
    const textarea = document.createElement('textarea');
    textarea.name = `${quizId}-${questionId}`;

    return textarea;
}

function createFileInput(questionId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.name = `${quizId}-${questionId}`;

    return input;
}



function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}


//  *this function is common in previewQuiz and practiceQuiz
function populateQuestions(questions, questionContainer) {

    questions.forEach((question, index) => {
        tArray.push(question.questionId);

        question.questionOptions = JSON.parse(question.questionOptions);
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionUpdateOptions = document.createElement('div');
        questionUpdateOptions.classList.add('question-top');
        const questionNumber = document.createElement('div');
        questionNumber.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks]";
        const editOptions = document.createElement('div');
        editOptions.classList.add('edit-options');
        const editBtn = editOptionBtn(question, 'btn-edit', 'fa-edit', '#' ,'message-edit', 'Edit Question');
        const deleteBtn = editOptionBtn(question, 'btn-delete', 'fa-trash', '#' ,'message-delete', 'Delete Question');
        editOptions.appendChild(editBtn);
        editOptions.appendChild(deleteBtn);
        questionUpdateOptions.appendChild(questionNumber);
        questionUpdateOptions.appendChild(editOptions);

        questionDiv.appendChild(questionUpdateOptions);


        if (question.questionType === 'MCQ') {
            const questionText = document.createElement('p');
            questionText.textContent = question.questionText;
            questionDiv.appendChild(questionText);
            for (let i = 0; i < question.questionOptions.length; i++) {
                const mcqOption = createRadioButton(question.questionId, question.questionOptions[i], i+1);
                questionDiv.appendChild(mcqOption);
            }

        } else if (question.questionType === 'TF') {
            const questionText = document.createElement('p');
            questionText.textContent = question.questionText;
            questionDiv.appendChild(questionText);

            const mcqOption1 = createRadioButton(question.questionId, question.questionOptions[0], 1);
            questionDiv.appendChild(mcqOption1);
            const mcqOption2 = createRadioButton(question.questionId, question.questionOptions[1], 2);
            questionDiv.appendChild(mcqOption2);

        } else if (question.questionType === 'FB') {
            const questionParts = question.questionText.split('_______');
            const questionText1 = document.createElement('p');
            questionText1.textContent = questionParts[0];
            questionDiv.appendChild(questionText1);

            const answerInput = createTextInput(question.questionId, 1);
            questionDiv.appendChild(answerInput);

            const questionText2 = document.createElement('p');
            questionText2.textContent = questionParts[1];
            questionDiv.appendChild(questionText2);

        } else if (question.questionType === 'FMB') {
            const questionParts = question.questionText.split('_______');
            var questionText = document.createElement('p');
            questionText.textContent = questionParts[0];
            questionDiv.appendChild(questionText);

            for (let i = 1; i < questionParts.length; i++) {
                const answerInput = createTextInput(question.questionId, i);
                questionDiv.appendChild(answerInput);

                questionText = document.createElement('p');
                questionText.textContent = questionParts[i];
                questionDiv.appendChild(questionText);
            }

        } else if (question.questionType === 'MA') {
            const questionText = document.createElement('p');
            questionText.textContent = question.questionText;
            questionDiv.appendChild(questionText);
            for (let i = 0; i < question.questionOptions.length; i++) {
                const maOption = createCheckBox(question.questionId, question.questionOptions[i], i+1);
                questionDiv.appendChild(maOption);
            }

        } else if (question.questionType === 'DD') {
            const questionText = document.createElement('p');
            questionText.textContent = question.questionText;
            questionDiv.appendChild(questionText);

            const dropdown = createDropdown(`${quizId}-${question.questionId}`, question.questionOptions);
            questionDiv.appendChild(dropdown);

        } else if (question.questionType === 'MATCH') {
            const questionText = document.createElement('p');
            questionText.textContent = question.questionText;
            questionDiv.appendChild(questionText);

            for (let i = 1; i < (question.questionOptions[0]+1); i++) {
                const label = document.createElement('label');
                label.textContent = question.questionOptions[i];
                questionDiv.appendChild(label);
                const match = createDropdown(`${quizId}-${question.questionId}-${question.questionOptions[i]}`, question.questionOptions.slice(question.questionOptions[0] + 1));
                questionDiv.appendChild(match);
            }

        } else if (question.questionType === 'NUM') {
            const questionParts = question.questionText.split('_______');
            var questionText = document.createElement('p');
            questionText.textContent = questionParts[0];
            questionDiv.appendChild(questionText);

            for (let i = 1; i < questionParts.length; i++) {
                const answerInput = createNumericInput(question.questionId, i);
                questionDiv.appendChild(answerInput);

                questionText = document.createElement('p');
                questionText.textContent = questionParts[i];
                questionDiv.appendChild(questionText);
            }

        } else if (question.questionType === 'ESSAY') {
            const questionText = document.createElement('p');
            questionText.textContent = question.questionText;
            questionDiv.appendChild(questionText);
            const answerTextarea = createTextarea(question.questionId);

            questionDiv.appendChild(answerTextarea);

        } else {
            const questionText = document.createElement('p');
            questionText.textContent = question.questionText;
            questionDiv.appendChild(questionText);
            const fileInput = createFileInput(question.questionId);

            questionDiv.appendChild(fileInput);
        }

        questionContainer.appendChild(questionDiv);
    });

    registeredQuestionIds[quizId] = tArray;

}

document.addEventListener('DOMContentLoaded', function() {
    const csrftoken = getCookie('csrftoken');
    fetch(quizUrl, {
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
          throw new Error('Error in Getting the Questions');
        }
        return response.json();
    })
    .then(data => {
        var questions = JSON.parse(data).map(item => item.fields);
        populateQuestions(questions, questionContainer);
        disableInteractivity();
    })
    .catch(error => {
        console.error('Error fetching quiz questions!', error);
    });

});


function disableInteractivity() {
    const inputs = questionContainer.querySelectorAll('input');
    const options = questionContainer.querySelectorAll('option');
    const textareas = questionContainer.querySelectorAll('textarea');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
    for (let i = 0; i < options.length; i++) {
        options[i].disabled = true;
    }
    for (let i = 0; i < textareas.length; i++) {
        textareas[i].disabled = true;
    }
}



const deletePopup = document.getElementById('delete-popup');
const deleteForm = document.getElementById('delete-form');
const confirmDeleteCheckbox = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');


function deleteQuestionToBackend(quizId, questionId) {
    const csrftoken = getCookie('csrftoken');
    fetch(deleteQuestionUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            quizId     : quizId,
            questionId : questionId,
        }),
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Error in deleting the question!');
        }
        return response.json();
    })
    .then(data => {
        window.location.href = thisPage;
    })
    .catch(error => {
        console.error('Error in deleting the Question!', error);
    });
}

deleteForm.addEventListener('submit', function(event) {
  event.preventDefault();
  if (confirmDeleteCheckbox.checked) {
    deleteQuestionToBackend(quizId, activeQuestionId);
  }
});

cancelDeleteBtn.addEventListener('click', function(event) {
    deletePopup.style.display = 'none';
    deleteForm.reset();
});

window.addEventListener('click', (event) => {
    if (event.target === deletePopup) {
        deletePopup.style.display = 'none';
        deleteForm.reset();
    }
});



window.addEventListener('click', (event) => {
    if (event.target === editQuestionPopup) {
        window.location.href = thisPage;
    }
});

const editQuestionPopup = document.getElementById('edit-question-popup');
const cancelEditQuestionBtn = document.getElementById('cancel-edit-question');

cancelEditQuestionBtn.addEventListener('click', function(event) {
    window.location.href = thisPage;
});


function addSpanBlank() {
    var span = document.createElement('span');
    span.contentEditable = false;
    span.style = "border-bottom: 1px dotted; padding-bottom: 1px;";
    span.textContent = '_______';

    return span;
}

function addDefaultValues(question) {
    document.getElementById('question-id').defaultValue = question.questionId;
    document.getElementById('question-marks').defaultValue = question.questionMarks;
    document.getElementById('question-type').value = question.questionType;
    toggleTextarea();
    addOptionFields();
    var textInput = document.getElementById('question-text-input');

    if (question.questionType === 'MCQ') {
        textInput.textContent = question.questionText;
        for (let i = 0; i < question.questionOptions.length; i++) {
            document.querySelector('.add-option').click();
            const index = i+1;
            document.getElementById(`option${index}`).value = question.questionOptions[i];
        }

    } else if (question.questionType === 'TF') {
        textInput.textContent = question.questionText;
        if (question.questionOptions[0] === 'False') {
            document.querySelector('.option-down').click();
        }

    } else if (question.questionType === 'FB') {
        const questionParts = question.questionText.split('_______');
        textInput.append(questionParts[0]);
        textInput.appendChild(addSpanBlank());
        textInput.append(questionParts[1]);

    } else if (question.questionType === 'FMB') {
        const questionParts = question.questionText.split('_______');
        textInput.append(questionParts[0]);

        for (let i = 1; i < questionParts.length; i++) {
            textInput.appendChild(addSpanBlank());
            textInput.append(questionParts[i]);
        }

    } else if (question.questionType === 'MA') {
        textInput.textContent = question.questionText;
        for (let i = 0; i < question.questionOptions.length; i++) {
            document.querySelector('.add-option').click();
            const index = i+1;
            document.getElementById(`option${index}`).value = question.questionOptions[i];
        }

    } else if (question.questionType === 'DD') {
        textInput.textContent = question.questionText;
        for (let i = 0; i < question.questionOptions.length; i++) {
            document.querySelector('.add-option').click();
            const index = i+1;
            document.getElementById(`option${index}`).value = question.questionOptions[i];
        }

    } else if (question.questionType === 'MATCH') {
        textInput.textContent = question.questionText;

        for (let i = 1; i < (question.questionOptions[0]+1); i++) {
            document.querySelector('.add-statement').click();
            document.getElementById(`statement${i}`).value = question.questionOptions[i];
        }
        for (let i = (question.questionOptions[0]+1); i < question.questionOptions.length; i++) {
            document.querySelector('.add-option').click();
            const index = i-question.questionOptions[0];
            document.getElementById(`option${index}`).value = question.questionOptions[i];
        }

    } else if (question.questionType === 'NUM') {
        const questionParts = question.questionText.split('_______');
        textInput.append(questionParts[0]);

        for (let i = 1; i < questionParts.length; i++) {
            textInput.appendChild(addSpanBlank());
            textInput.append(questionParts[i]);
        }

    } else if (question.questionType === 'ESSAY') {
        textInput.textContent = question.questionText;

    } else {
        textInput.textContent = question.questionText;
    }
}