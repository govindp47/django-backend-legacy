
const questionContainer = document.getElementById('question-container');
const quizForm = document.getElementById('quiz-form');
const scoreContainer = document.getElementById('score-container');
var quizId = 'Aa12345';

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
    container.classList.add('option-class');
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
    container.classList.add('option-class');
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

function populateQuestions(questions) {

    questions.forEach((question, index) => {
        question.questionOptions = JSON.parse(question.questionOptions);
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        if (question.questionType === 'MCQ') {
            const questionText = document.createElement('p');
            questionText.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks] " + question.questionText;
            questionDiv.appendChild(questionText);
            for (let i = 0; i < question.questionOptions.length; i++) {
                const mcqOption = createRadioButton(question.questionId, question.questionOptions[i], i+1);
                questionDiv.appendChild(mcqOption);
            }

        } else if (question.questionType === 'TF') {
            const questionText = document.createElement('p');
            questionText.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks] " + question.questionText;
            questionDiv.appendChild(questionText);

            const mcqOption1 = createRadioButton(question.questionId, question.questionOptions[0], 1);
            questionDiv.appendChild(mcqOption1);
            const mcqOption2 = createRadioButton(question.questionId, question.questionOptions[1], 2);
            questionDiv.appendChild(mcqOption2);

        } else if (question.questionType === 'FB') {
            const tdiv = document.createElement('div');
            tdiv.classList.add('blank-class');
            const questionParts = question.questionText.split('_______');
            const questionText1 = document.createElement('p');
            questionText1.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks] " + questionParts[0];
            tdiv.appendChild(questionText1);

            const answerInput = createTextInput(question.questionId, 1);
            tdiv.appendChild(answerInput);

            const questionText2 = document.createElement('p');
            questionText2.textContent = questionParts[1];
            tdiv.appendChild(questionText2);
            questionDiv.appendChild(tdiv);

        } else if (question.questionType === 'FMB') {
            const tdiv = document.createElement('div');
            tdiv.classList.add('blank-class');
            const questionParts = question.questionText.split('_______');
            var questionText = document.createElement('p');
            questionText.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks] " + questionParts[0];
            tdiv.appendChild(questionText);

            for (let i = 1; i < questionParts.length; i++) {
                const answerInput = createTextInput(question.questionId, i);
                tdiv.appendChild(answerInput);

                questionText = document.createElement('p');
                questionText.textContent = questionParts[i];
                tdiv.appendChild(questionText);
            }
            questionDiv.appendChild(tdiv);

        } else if (question.questionType === 'MA') {
            const questionText = document.createElement('p');
            questionText.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks] " + question.questionText;
            questionDiv.appendChild(questionText);
            for (let i = 0; i < question.questionOptions.length; i++) {
                const maOption = createCheckBox(question.questionId, question.questionOptions[i], i+1);
                questionDiv.appendChild(maOption);
            }

        } else if (question.questionType === 'DD') {
            const questionText = document.createElement('p');
            questionText.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks] " + question.questionText;
            questionDiv.appendChild(questionText);

            const dropdown = createDropdown(`${quizId}-${question.questionId}`, question.questionOptions);
            const tdiv = document.createElement('div');
            tdiv.classList.add('option-class');
            tdiv.appendChild(dropdown);
            questionDiv.appendChild(tdiv);

        } else if (question.questionType === 'MATCH') {
            const questionText = document.createElement('p');
            questionText.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks] " + question.questionText;
            questionDiv.appendChild(questionText);

            for (let i = 1; i < (question.questionOptions[0]+1); i++) {
                const tdiv = document.createElement('div');
                const label = document.createElement('label');
                label.textContent = i.toString() + ". " + question.questionOptions[i];
                tdiv.appendChild(label);
                tdiv.classList.add('match-class');
                const match = createDropdown(`${quizId}-${question.questionId}-${question.questionOptions[i]}`, question.questionOptions.slice(question.questionOptions[0] + 1));
                tdiv.appendChild(match);
                questionDiv.appendChild(tdiv);
            }

        } else if (question.questionType === 'NUM') {
            const tdiv = document.createElement('div');
            tdiv.classList.add('blank-class');
            const questionParts = question.questionText.split('_______');
            var questionText = document.createElement('p');
            questionText.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks] " + questionParts[0];
            tdiv.appendChild(questionText);

            for (let i = 1; i < questionParts.length; i++) {
                const answerInput = createNumericInput(question.questionId, i);
                tdiv.appendChild(answerInput);

                questionText = document.createElement('p');
                questionText.textContent = questionParts[i];
                tdiv.appendChild(questionText);
            }
            questionDiv.appendChild(tdiv);

        } else if (question.questionType === 'ESSAY') {
            const questionText = document.createElement('p');
            questionText.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks] " + question.questionText;
            questionDiv.appendChild(questionText);
            const answerTextarea = createTextarea(question.questionId);

            questionDiv.appendChild(answerTextarea);

        } else {
            const questionText = document.createElement('p');
            questionText.textContent = (index+1).toString() + ". [" + parseFloat(question.questionMarks).toString() + " Marks] " + question.questionText;
            questionDiv.appendChild(questionText);
            const fileInput = createFileInput(question.questionId);

            questionDiv.appendChild(fileInput);
        }

        questionContainer.appendChild(questionDiv);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const csrftoken = getCookie('csrftoken');
    quizId = 'Q1';
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
        populateQuestions(questions);
    })
    .catch(error => {
        console.error('Error fetching quiz questions!', error);
    });

});



function collectSelectedAnswers() {
    const selectedAnswers = {};

    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        const questionId = question.dataset.questionId;
        const selectedOption = question.querySelector('input:checked');
        
        if (selectedOption) {
            selectedAnswers[questionId] = selectedOption.value;
        }
    });

    return selectedAnswers;
}

function calculateScore(selectedAnswers) {
    let score = 0;

    // Calculate the score based on the selected answers
    // You can customize the scoring logic according to your requirements

    return score;
}

function displayScore(score) {
    scoreContainer.textContent = `Your score: ${score}`;
}

quizForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const selectedAnswers = collectSelectedAnswers();
    const score = calculateScore(selectedAnswers);
    
    displayScore(score);
});
