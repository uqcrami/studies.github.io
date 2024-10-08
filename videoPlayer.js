document.addEventListener('DOMContentLoaded', function() {
    // Set common title
    document.title = studyConfig.title;
    document.querySelector('h1').textContent = studyConfig.title;

    let currentVideoIndex = 0;
    let currentQuestionIndex = 0;

    const videoPlayer = document.getElementById('currentVideo');
    const questionnaire = document.getElementById('questionnaire');
    const answerBox = document.getElementById('answerBox');
    const continueButton = document.getElementById('Continue');
    const endButton = document.getElementById('end');

    function loadVideo() {
        const currentVideoConfig = studyConfig.videoSequence[currentVideoIndex];
        console.log(`Loading video file: ${currentVideoConfig.src}`);
        if (currentVideoConfig.type === "sideBySide") {
            document.getElementById('singleVideoContainer').style.display = 'none';
            document.getElementById('sideBySideContainer').style.display = 'flex';
            document.getElementById('leftVideo').src = currentVideoConfig.src[0];
            document.getElementById('rightVideo').src = currentVideoConfig.src[1];
            
            // Apply the new layout
            document.querySelector('.container').classList.add('side-by-side-layout');
            
            // Remove previous event listeners before adding new ones
            const leftVideo = document.getElementById('leftVideo');
            const rightVideo = document.getElementById('rightVideo');
            
            leftVideo.removeEventListener('ended', checkBothVideosEnded);
            rightVideo.removeEventListener('ended', checkBothVideosEnded);
            
            leftVideo.addEventListener('ended', checkBothVideosEnded);
            rightVideo.addEventListener('ended', checkBothVideosEnded);
        } else {
            document.getElementById('singleVideoContainer').style.display = 'block';
            document.getElementById('sideBySideContainer').style.display = 'none';
            videoPlayer.src = currentVideoConfig.src;
            
            // Remove the side-by-side layout class if it was previously added
            document.querySelector('.container').classList.remove('side-by-side-layout');
            
            // Remove previous event listener before adding a new one
            videoPlayer.removeEventListener('ended', showQuestionnaire);
            videoPlayer.addEventListener('ended', showQuestionnaireOnce);
        }
        document.getElementById('currentVideoNumber').textContent = currentVideoIndex + 1;
        questionnaire.style.display = 'none';
    }

    // New function to ensure questionnaire is shown only once
    function showQuestionnaireOnce() {
        if (currentQuestionIndex === 0) {
            showQuestionnaire();
        }
    }

    function checkBothVideosEnded() {
        const leftVideo = document.getElementById('leftVideo');
        const rightVideo = document.getElementById('rightVideo');
        
        if (leftVideo.ended && rightVideo.ended && currentQuestionIndex === 0) {
            showQuestionnaire();
        }
    }

    function showQuestionnaire() {
        questionnaire.style.display = 'block';
        currentQuestionIndex = 0;
        showQuestion(1);
    }

    function showQuestion(questionNumber) {
        document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
        const questionElement = document.getElementById(`question${questionNumber}`);
        removeBackToQuestion5Buttons();
        questionElement.style.display = 'block';
        
        const labelElement = questionElement.querySelector('label');
        labelElement.textContent = studyConfig.videoSequence[currentVideoIndex].questions[questionNumber - 1];
        
        if (questionNumber === 4) {
            setupMultipleChoiceQuestion();
        }

    }

    function removeBackToQuestion5Buttons() {
        const backButtons = document.querySelectorAll('.back-to-q5');
        backButtons.forEach(button => button.remove());
    }



    function setupMultipleChoiceQuestion() {
        const q4Options = document.getElementById('q4Options');
        q4Options.innerHTML = '';
        studyConfig.questionOptions.q4.forEach((option, index) => {
            if (option !== "Add other element not listed") {
                q4Options.innerHTML += `
                    <input type="checkbox" id="vid_q4_${index}" name="vid_q4" value="${option}">
                    <label for="vid_q4_${index}">${option}</label><br>
                `;
            }
        });

        // Setup "other" option
        const otherCheckbox = document.getElementById('vid_q4_other');
        const otherTextInput = document.getElementById('vid_q4_other_text');
        
        otherCheckbox.addEventListener('change', function() {
            otherTextInput.style.display = this.checked ? 'block' : 'none';
        });
    }

    function clearMultipleChoiceAnswers() {
        document.querySelectorAll('input[name="vid_q4"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        document.getElementById('vid_q4_other_text').value = '';
        document.getElementById('vid_q4_other_text').style.display = 'none';
    }

    // Move these functions to the global scope
    function nextQuestion(currentQuestion) {
        if (validateAnswer(currentQuestion)) {
            saveAnswer(currentQuestion);
            currentQuestionIndex++;
            if (currentQuestionIndex < 5) {
                showQuestion(currentQuestionIndex + 1);
            } else {
                showQuestion5();
            }
            updateAnswerBox(); // Move this here to update after saving and incrementing
        }
    }

    function validateAnswer(questionNumber) {
        if (questionNumber === 4) {
            const selectedOptions = document.querySelectorAll('input[name="vid_q4"]:checked');
            if (selectedOptions.length === 0) {
                alert('Please select at least one option.');
                return false;
            }
            const otherCheckbox = document.getElementById('vid_q4_other');
            const otherTextInput = document.getElementById('vid_q4_other_text');
            if (otherCheckbox.checked && otherTextInput.value.trim() === '') {
                alert('Please specify the other option.');
                return false;
            }
        } else {
            const answer = document.getElementById(`vid_q${questionNumber}`).value.trim();
            if (answer === '') {
                alert('Please answer the question before proceeding.');
                return false;
            }
        }
        return true;
    }

    function saveAnswer(questionNumber) {
        let answer;
        if (questionNumber === 4) {
            const selectedOptions = Array.from(document.querySelectorAll('input[name="vid_q4"]:checked'));
            answer = selectedOptions.map(option => {
                if (option.id === 'vid_q4_other') {
                    return `Other: ${document.getElementById('vid_q4_other_text').value.trim()}`;
                }
                return option.value;
            }).join(', ');
        } else {
            answer = document.getElementById(`vid_q${questionNumber}`).value;
        }
        localStorage.setItem(`video${currentVideoIndex + 1}_q${questionNumber}`, answer);
        // Remove the updateAnswerBox() call from here
    }

    function updateAnswerBox() {
        const answerContent = document.getElementById('answerContent');
        answerContent.innerHTML = '';
        for (let i = 1; i <= currentQuestionIndex; i++) {
            const answer = localStorage.getItem(`video${currentVideoIndex + 1}_q${i}`);
            if (answer) {
                answerContent.innerHTML += `<p><strong>Q${i}:</strong> ${answer}</p>`;
            }
        }
    }

    function submitForm() {
        let satisfiedYes = document.getElementById('vid_q5_yes');
        let satisfiedNo = document.getElementById('vid_q5_no');
        
        if (!satisfiedYes.checked && !satisfiedNo.checked) {
            alert('Please select whether you are satisfied with your answers.');
            return;
        }
        
        if (satisfiedYes.checked) {
            saveAnswersAndContinue();
        } else {
            // If "No" is selected, the change answers section is already visible
            // User can select which question to change
        }
    }

    function changeAnswer() {
        let questionNumber = document.getElementById('questionToChange').value;
        document.getElementById('question5').style.display = 'none';
        const questionElement = document.getElementById(`question${questionNumber}`);
        questionElement.style.display = 'block';
        
        // Restore previous answer
        const previousAnswer = localStorage.getItem(`video${currentVideoIndex + 1}_q${questionNumber}`);
        if (previousAnswer) {
            if (questionNumber === '4') {
                restoreMultipleChoiceAnswer(previousAnswer);
            } else {
                document.getElementById(`vid_q${questionNumber}`).value = previousAnswer;
            }
        }
        
        // Add a "Back to Question 5" button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Question 5';
        backButton.onclick = function() {
            if (validateAnswer(parseInt(questionNumber))) {
                saveAnswer(parseInt(questionNumber));
                updateAnswerBox();
                questionElement.style.display = 'none';
                showQuestion5();
                this.remove(); // Remove the "Back to Question 5" button
            }
            // If the answer is not valid, validateAnswer will show an alert
        };
        questionElement.appendChild(backButton);
    }

    function restoreMultipleChoiceAnswer(previousAnswer) {
        const options = previousAnswer.split(', ');
        document.querySelectorAll('input[name="vid_q4"]').forEach(checkbox => checkbox.checked = false);
        document.getElementById('vid_q4_other_text').style.display = 'none';
        
        options.forEach(option => {
            if (option.startsWith('Other:')) {
                document.getElementById('vid_q4_other').checked = true;
                document.getElementById('vid_q4_other_text').value = option.replace('Other: ', '');
                document.getElementById('vid_q4_other_text').style.display = 'block';
            } else {
                const checkbox = Array.from(document.querySelectorAll('input[name="vid_q4"]'))
                    .find(input => input.value === option);
                if (checkbox) {
                    checkbox.checked = true;
                }
            }
        });
    }

    function showAnswerBox() {
        answerBox.style.display = 'block';
        document.getElementById('currentVideoNumber').textContent = currentVideoIndex + 1;
        updateAnswerBox(); // Add this line to update the content when showing the answer box
    }

    function showNavigationButtons() {
        if (currentVideoIndex < studyConfig.videoSequence.length - 1) {
            continueButton.style.display = 'block';
            endButton.style.display = 'block';
        } else {
            endButton.style.display = 'block';
        }
    }

    continueButton.addEventListener('click', loadNextVideo);
    endButton.addEventListener('click', endStudy);
    endButton.style.display = 'block';

    function loadNextVideo() {
        currentVideoIndex++;
        if (currentVideoIndex > studyConfig.videoSequence.length) {
            endStudy();
        }
        currentQuestionIndex = 0; // Reset the question index for the new video
        resetUI();
        clearAnswers();
        loadVideo();
        showAnswerBox();
    }

    function resetUI() {
        document.getElementById('singleVideoContainer').style.display = 'block';
        questionnaire.style.display = 'none';
        answerBox.style.display = 'none';
        continueButton.style.display = 'none';
        endButton.style.display = 'block';
        clearInputFields();
        removeBackToQuestion5Buttons();
    }

    function clearAnswers() {
        const answerContent = document.getElementById('answerContent');
        answerContent.innerHTML = '';
    }

    function clearInputFields() {
        // Clear text inputs
        document.querySelectorAll('input[type="text"]').forEach(input => {
            input.value = '';
        });

        // Uncheck radio buttons and checkboxes
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            input.checked = false;
        });

        // Clear and hide the "other" text input for question 4
        const otherTextInput = document.getElementById('vid_q4_other_text');
        otherTextInput.value = '';
        otherTextInput.style.display = 'none';
    }

    function endStudy() {
        // Prepare data for download
        let studyData = {};
        for (let i = 0; i < studyConfig.videoSequence.length; i++) {
            studyData[`video${i + 1}`] = {};
            for (let j = 1; j <= 5; j++) {
                studyData[`video${i + 1}`][`q${j}`] = localStorage.getItem(`video${i + 1}_q${j}`);
            }
        }
        
        // Create and trigger download
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(studyData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "study_results.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        setTimeout(() => {
            window.location.href = 'end.html';
        }, 1000); // 1 second delay

    }

    // Start the study
    loadVideo();

    // Remove the setupNextButtons function and add event listeners here
    for (let i = 1; i <= 4; i++) {
        const nextButton = document.querySelector(`#question${i} button`);
        nextButton.addEventListener('click', () => nextQuestion(i));
    }

    document.querySelector('#question5 button[type="button"]').addEventListener('click', submitForm);
    document.querySelector('#changeAnswers button').addEventListener('click', changeAnswer);

    const question5 = document.getElementById('question5');
    const satisfiedYes = document.getElementById('vid_q5_yes');
    const satisfiedNo = document.getElementById('vid_q5_no');
    const changeAnswers = document.getElementById('changeAnswers');
    const submitQ5 = document.getElementById('submitQ5');
    const changeAnswerBtn = document.getElementById('changeAnswerBtn');

    function showQuestion5() {
        question5.style.display = 'block';
        changeAnswers.style.display = 'none';
        satisfiedYes.checked = false;
        satisfiedNo.checked = false;
        // removeBackToQuestion5Buttons();
    }

    function handleQ5Selection() {
        if (satisfiedNo.checked) {
            changeAnswers.style.display = 'block';
        } else {
            changeAnswers.style.display = 'none';
        }
    }

    satisfiedYes.addEventListener('change', handleQ5Selection);
    satisfiedNo.addEventListener('change', handleQ5Selection);

    submitQ5.addEventListener('click', function() {
        if (!satisfiedYes.checked && !satisfiedNo.checked) {
            alert('Please select whether you are satisfied with your answers.');
            return;
        }

        if (satisfiedYes.checked) {
            saveAnswersAndContinue();
        } else {
            // If "No" is selected, the change answers section is already visible
            // User can select which question to change
        }
    });

    changeAnswerBtn.addEventListener('click', function() {
        const questionToChange = document.getElementById('questionToChange').value;
        showQuestion(parseInt(questionToChange));
        question5.style.display = 'none';
    });

    function saveAnswersAndContinue() {
        localStorage.setItem(`video${currentVideoIndex + 1}_q5_satisfied`, 'Yes');
        questionnaire.style.display = 'none';
        showAnswerBox();
        showNavigationButtons();
    }
});