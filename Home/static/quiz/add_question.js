var number_of_options = 0;
var number_of_statements = 0;
const questionForm = document.getElementById('question-form');
var optionsContainer = document.getElementById('options-container');
var questionType = document.getElementById('question-type');
var buttonsContainer = document.getElementById('buttons-container');
var questionText = document.getElementById('question-text');
var questionTextInput = document.getElementById('question-text-input');
var questionTextMessage = document.getElementById('question-text-message');

function toggleTextarea(event) {
    if (questionType.value === "") {
      questionTextInput.contentEditable = false;
    } else {
      questionTextInput.contentEditable = true;
    }
  }

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}

function swapOptionsText(currentOption, prevOption) {
    var currentInput = currentOption.querySelector('input');
    var prevInput = prevOption.querySelector('input');

    var currentInputText = currentInput.value;
    var prevInputText = prevInput.value;

    currentInput.value = prevInputText;
    prevInput.value = currentInputText;
}

function addNewOption(event, optionsContainer) {
    event.preventDefault();

    var index = number_of_options+1;
    var optionLabel = document.createElement('label');
    optionLabel.innerText = 'Option ' + index + ':';
    optionLabel.classList.add('required-label');
    
    var optionInput = document.createElement('input');
    const inputId = `option${index}`;
    optionInput.type = 'text';
    optionInput.name = inputId;
    optionInput.id = inputId;
    optionInput.required = true;
    optionLabel.setAttribute('for', inputId);
    
    var deleteOption = document.createElement('button');
    deleteOption.innerText = 'Delete Option';
    deleteOption.classList.add('delete-option');

    var optionUp = document.createElement('button');
    optionUp.innerText = 'Up';
    optionUp.classList.add('option-up');

    var optionDown = document.createElement('button');
    optionDown.innerText = 'Down';
    optionDown.classList.add('option-down');

    var resetOption = document.createElement('button');
    resetOption.innerText = 'Reset';
    resetOption.classList.add('reset-option');

    const opContainer = document.createElement('div');
    opContainer.dataset.currentOption = index;
    opContainer.appendChild(optionLabel);
    opContainer.appendChild(deleteOption);
    opContainer.appendChild(optionUp);
    opContainer.appendChild(optionDown);
    opContainer.appendChild(resetOption);
    opContainer.appendChild(optionInput);

    optionsContainer.appendChild(opContainer);

    number_of_options++;

    deleteOption.addEventListener("click", function(event) {
        event.preventDefault();

        var currentIndex = event.target.parentNode.dataset.currentOption-1;
        var optionsContainerInputs = optionsContainer.querySelectorAll('input');

        for (let i = currentIndex; i < (optionsContainerInputs.length-1); i++) {
            optionsContainerInputs[i].value = optionsContainerInputs[i+1].value;
        }

        number_of_options--;
        optionsContainerInputs[optionsContainerInputs.length-1].parentNode.remove();
    });

    optionUp.addEventListener("click", function(event) {
        event.preventDefault();
        var currentOption = event.target.parentNode;
        var prevOption = currentOption.previousElementSibling;
        if (prevOption) {
            swapOptionsText(currentOption,prevOption);
        }
    });

    optionDown.addEventListener("click", function(event) {
        event.preventDefault();
        var currentOption = event.target.parentNode;
        var nextOption = currentOption.nextElementSibling;
        if (nextOption) {
            swapOptionsText(nextOption, currentOption);
        }
    });

    resetOption.addEventListener("click", function(event) {
        event.preventDefault();
        var currentIndex = event.target.parentNode.dataset.currentOption-1;
        var optionsContainerInputs = optionsContainer.querySelectorAll('input');
        optionsContainerInputs[currentIndex].value = null;
    });
}

function addMcqOptions() {
    number_of_options = 0;

    var addOption = document.createElement('button');
    addOption.innerText = 'Add Option';
    addOption.classList.add('add-option');
    buttonsContainer.appendChild(addOption);

    var resetOptions = document.createElement('button');
    resetOptions.innerText = 'Reset Options';
    resetOptions.classList.add('reset-options');
    buttonsContainer.appendChild(resetOptions);

    addOption.addEventListener("click", function(event) {
        addNewOption(event, optionsContainer);
    });

    resetOptions.addEventListener("click", function(event) {
        event.preventDefault();
        optionsContainer.innerHTML = '';
        number_of_options = 0;
    });
}

function createTfoption(index, value) {
    var optionLabel = document.createElement('label');
    optionLabel.innerText = 'Option ' + index + ':';
    optionLabel.classList.add('required-label');
    
    var optionInput = document.createElement('input');
    const inputId = `option${index}`;
    optionInput.type = 'text';
    optionInput.name = inputId;
    optionInput.id = inputId;
    optionInput.value = value;
    optionInput.disabled = true;
    optionLabel.setAttribute('for', inputId);

    var optionUp = document.createElement('button');
    optionUp.innerText = 'Up';
    optionUp.classList.add('option-up');

    var optionDown = document.createElement('button');
    optionDown.innerText = 'Down';
    optionDown.classList.add('option-down');

    const opContainer = document.createElement('div');
    opContainer.appendChild(optionLabel);
    opContainer.appendChild(optionUp);
    opContainer.appendChild(optionDown);
    opContainer.appendChild(optionInput);

    optionUp.addEventListener("click", function(event) {
        event.preventDefault();
        var currentOption = event.target.parentNode;
        var prevOption = currentOption.previousElementSibling;
        if (prevOption) {
            swapOptionsText(currentOption,prevOption);
        }
    });

    optionDown.addEventListener("click", function(event) {
        event.preventDefault();
        var currentOption = event.target.parentNode;
        var nextOption = currentOption.nextElementSibling;
        if (nextOption) {
            swapOptionsText(nextOption, currentOption);
        }
    });

    return opContainer;
}

function addTfOptions() {
    optionsContainer.appendChild(createTfoption(1, 'True'));
    optionsContainer.appendChild(createTfoption(2, 'False'));
}

function addNewBlank() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (questionTextInput.contains(range.startContainer) && questionTextInput.contains(range.endContainer)) {
            var span = document.createElement('span');
            span.contentEditable = false;
            span.style = "border-bottom: 1px dotted; padding-bottom: 1px;";
            span.textContent = '_______';
            
            range.deleteContents();
            range.insertNode(span);
            range.collapse(false);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    updateQuestionText();
}

function addOneBlank(event) {
    event.preventDefault();

    var currentBlanks = questionTextInput.querySelectorAll('span').length;
    if (currentBlanks==0 ){
        questionTextMessage.style.display = 'none';
        addNewBlank();
    } else{
        questionTextMessage.style.display = 'block';
        questionTextMessage.textContent = "only one blank can be added. for multiple, use multiple blank question type!";
    }
}

function addFbOptions() {
    var addBlank = document.createElement('button');
    addBlank.innerText = 'Add Blank';
    addBlank.classList.add('add-blank');
    buttonsContainer.appendChild(addBlank);

    var resetBlank = document.createElement('button');
    resetBlank.innerText = 'Reset Blank';
    resetBlank.classList.add('reset-blank');
    buttonsContainer.appendChild(resetBlank);

    addBlank.addEventListener("click", addOneBlank);

    resetBlank.addEventListener("click", function(event) {
        event.preventDefault();
        const spans = questionTextInput.querySelectorAll('span');
        spans.forEach(span => {
            span.remove();
        });
    });
}

function addMultipleBlank(event) {
    event.preventDefault();
    addNewBlank();
}

function addFmbOptions() {
    var addBlank = document.createElement('button');
    addBlank.innerText = 'Add Blank';
    addBlank.classList.add('add-blank');
    buttonsContainer.appendChild(addBlank);

    var resetBlank = document.createElement('button');
    resetBlank.innerText = 'Reset Blanks';
    resetBlank.classList.add('reset-blank');
    buttonsContainer.appendChild(resetBlank);

    addBlank.addEventListener("click", addMultipleBlank);

    resetBlank.addEventListener("click", function(event) {
        event.preventDefault();
        const spans = questionTextInput.querySelectorAll('span');
        spans.forEach(span => {
            span.remove();
        });
    });
}

function addNewStatement(event, statementContainer) {
    event.preventDefault();

    var index = number_of_statements+1;
    var statementLabel = document.createElement('label');
    statementLabel.innerText = 'Statement ' + index + ':';
    statementLabel.classList.add('required-label');
    
    var statementInput = document.createElement('input');
    const inputId = `statement${index}`;
    statementInput.type = 'text';
    statementInput.name = inputId;
    statementInput.id = inputId;
    statementInput.required = true;
    statementLabel.setAttribute('for', inputId);
    
    var deleteStatement = document.createElement('button');
    deleteStatement.innerText = 'Delete Statement';
    deleteStatement.classList.add('delete-statement');

    var statementUp = document.createElement('button');
    statementUp.innerText = 'Up';
    statementUp.classList.add('statement-up');

    var statementDown = document.createElement('button');
    statementDown.innerText = 'Down';
    statementDown.classList.add('statement-down');

    var resetStatement = document.createElement('button');
    resetStatement.innerText = 'Reset';
    resetStatement.classList.add('reset-option');

    const opContainer = document.createElement('div');
    opContainer.dataset.currentStatement = index;
    opContainer.appendChild(statementLabel);
    opContainer.appendChild(deleteStatement);
    opContainer.appendChild(statementUp);
    opContainer.appendChild(statementDown);
    opContainer.appendChild(resetStatement);
    opContainer.appendChild(statementInput);

    statementContainer.appendChild(opContainer);

    number_of_statements++;

    deleteStatement.addEventListener("click", function(event) {
        event.preventDefault();

        var currentIndex = event.target.parentNode.dataset.currentStatement-1;
        var statementContainerInputs = statementContainer.querySelectorAll('input');

        for (let i = currentIndex; i < (statementContainerInputs.length-1); i++) {
            statementContainerInputs[i].value = statementContainerInputs[i+1].value;
        }

        number_of_statements--;
        statementContainerInputs[statementContainerInputs.length-1].parentNode.remove();
    });

    statementUp.addEventListener("click", function(event) {
        event.preventDefault();
        var currentStatement = event.target.parentNode;
        var prevStatement = currentStatement.previousElementSibling;
        if (prevStatement) {
            swapOptionsText(currentStatement,prevStatement);
        }
    });

    statementDown.addEventListener("click", function(event) {
        event.preventDefault();
        var currentStatement = event.target.parentNode;
        var nextStatement = currentStatement.nextElementSibling;
        if (nextStatement) {
            swapOptionsText(nextStatement, currentStatement);
        }
    });

    resetStatement.addEventListener("click", function(event) {
        event.preventDefault();
        var currentIndex = event.target.parentNode.dataset.currentStatement-1;
        var statementContainerInputs = statementContainer.querySelectorAll('input');
        statementContainerInputs[currentIndex].value = null;
    });
}

function addMatchOptions() {
    number_of_statements = 0;
    number_of_options = 0;

    var statementContainer = document.createElement('div');
    var optionContainer = document.createElement('div');

    optionsContainer.appendChild(statementContainer);
    optionsContainer.appendChild(optionContainer);

    var addStatement = document.createElement('button');
    addStatement.innerText = 'Add Statement';
    addStatement.classList.add('add-statement');
    buttonsContainer.appendChild(addStatement);

    var resetStatements = document.createElement('button');
    resetStatements.innerText = 'Reset Statements';
    resetStatements.classList.add('reset-options');
    buttonsContainer.appendChild(resetStatements);

    var addOption = document.createElement('button');
    addOption.innerText = 'Add Option';
    addOption.classList.add('add-option');
    buttonsContainer.appendChild(addOption);

    var resetOptions = document.createElement('button');
    resetOptions.innerText = 'Reset Options';
    resetOptions.classList.add('reset-options');
    buttonsContainer.appendChild(resetOptions);

    addStatement.addEventListener("click", function(event) {
        addNewStatement(event, statementContainer);
    });
    addOption.addEventListener("click", function(event) {
        addNewOption(event, optionContainer);
    });

    resetOptions.addEventListener("click", function(event) {
        event.preventDefault();
        optionContainer.innerHTML = '';
        number_of_options = 0;
    });

    resetStatements.addEventListener("click", function(event) {
        event.preventDefault();
        statementContainer.innerHTML = '';
        number_of_statements = 0;
    });
}

function addOptionFields() {

    questionTextInput.innerHTML = '';
    questionText.value = '';
    questionTextMessage.style.display = 'none';
    buttonsContainer.innerHTML = '';
    optionsContainer.innerHTML = '';

    if (questionType.value === 'MCQ') {
        addMcqOptions();
    } else if (questionType.value === 'TF') {
        addTfOptions();
    } else if (questionType.value === 'FB') {
        addFbOptions();
    } else if (questionType.value === 'FMB') {
        addFmbOptions();
    } else if (questionType.value === 'MA') {
        addMcqOptions();
    } else if (questionType.value === 'DD') {
        addMcqOptions();
    } else if (questionType.value === 'MATCH') {
        addMatchOptions();
    } else if (questionType.value === 'NUM') {
        addFmbOptions();
    }
}

questionType.addEventListener('change', addOptionFields);

function handleSubmit(event) {
    event.preventDefault();

    const quizId = document.getElementById('quiz-id').value;
    const csrftoken = getCookie('csrftoken');
    var formData = new FormData(questionForm);
    var jsonData = {};

    for (var pair of formData.entries()) {
      jsonData[pair[0]] = pair[1];
    }

    var options = [];
    if (jsonData['question-type'] === 'TF') {
        options.push(document.getElementById('option1').value);
        options.push(document.getElementById('option2').value);
    } else if (jsonData['question-type'] === 'MATCH') {
        options.push(0);
        let s = 1;
        while (`statement${s}` in jsonData) {
            options.push(jsonData[`statement${s}`]);
            s++;
            options[0]++;
        }
    }

    let i = 1;
    while (`option${i}` in jsonData) {
        options.push(jsonData[`option${i}`]);
        i++;
    }

    fetch('/quiz/save-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            quizId : quizId,
            oldQuestionId : oldQuestionId,
            questionId : jsonData['question-id'],
            questionType : jsonData['question-type'],
            questionMarks : jsonData['question-marks'],
            questionText : jsonData['question-text'],
            questionOptions : JSON.stringify(options),
        }),
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Error in saving the question!');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        registeredQuestionIds[activeQuizId].push(jsonData['question-id']);
        resetQuestion(event);
        questionForm.reset();
    })
    .catch(error => {
        console.error('Error in fetching!', error);
    });
}


// questionForm.addEventListener('submit', handleSubmit);

function resetQuestion(event) {
    questionType.value = "";
    toggleTextarea(event);
    addOptionFields(event);
}

function resetQuestionId(event) {
    event.preventDefault();
    document.getElementById('question-id').value = null;
}

function resetQuestionMarks(event) {
    event.preventDefault();
    document.getElementById('question-marks').value = null;
}

function resetQuestionType(event) {
    event.preventDefault();
    resetQuestion(event);
}

function resetQuestionText(event) {
    event.preventDefault();
    questionTextInput.innerHTML = '';
    questionText.value = '';
    questionTextMessage.style.display = 'none';
}

function updateQuestionText() {
    questionText.value = questionTextInput.innerText;
}

function submitForm(event) {
    updateQuestionText();
    if (questionText.value === '') {
        event.preventDefault();
        questionTextMessage.style.display = 'block';
        questionTextMessage.textContent = "Question text is required.";
        return false;
    } else if (questionType in ['FB', 'FMB', 'NUM']) {
        if (questionTextInput.querySelectorAll('span').length === 0) {
            event.preventDefault();
            questionTextMessage.style.display = 'block';
            questionTextMessage.textContent = "Atleast one blank is required!";
            return false;
        } else{
            questionTextMessage.style.display = 'none';
            return true;
        }
    } else {
        questionTextMessage.style.display = 'none';
        return true;
    }
}

function saveForm(event) {
    const questionId = document.getElementById('question-id').value;
    if (questionId!=oldQuestionId && registeredQuestionIds[activeQuizId].includes(questionId)){
        event.preventDefault();
    } else{
        if (submitForm(event)) {
            handleSubmit(event);
            window.location.href = thisPage;
        }
    }
}

function saveAddForm(event) {
    const questionId = document.getElementById('question-id').value;
    if (registeredQuestionIds[activeQuizId].includes(questionId)){
        event.preventDefault();
    } else{
        if (submitForm(event)) {
            handleSubmit(event);
        }
    }
}


const questionIdInput = document.getElementById('question-id');
const questionIdStatus = document.getElementById('question-id-status');
const questionIdStatusIcon = questionIdStatus.querySelector('i');

questionIdInput.addEventListener('input', function() {
    const questionId = questionIdInput.value;
    
    if (questionId === '') {
      questionIdStatusIcon.classList.remove('fa-check');
      questionIdStatusIcon.classList.add('fa-times');
      questionIdStatus.title = 'Invalid Question ID!';
    } else if (questionId!=oldQuestionId && registeredQuestionIds[activeQuizId].includes(questionId)){
      questionIdStatusIcon.classList.remove('fa-check');
      questionIdStatusIcon.classList.add('fa-times');
      questionIdStatus.title = 'Question ID already exists!';
    } else {
      questionIdStatusIcon.classList.remove('fa-times');
      questionIdStatusIcon.classList.add('fa-check');
      questionIdStatus.title = 'Question ID is available!';
    }
});

