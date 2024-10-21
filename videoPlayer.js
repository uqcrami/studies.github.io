document.addEventListener('DOMContentLoaded', () => {
  // Access the study configuration from config.js
  const studyConfig = window.studyConfig;
  const videoFilenames = window.videoFilenames;

  let currentVideoIndex = 0;
  let currentQuestionIndex = 0;
  let responses = [];
  let videoEnded = false;

  const videoContainer = document.getElementById('videoContainer');
  const questionnaireContainer = document.getElementById('questionnaireContainer');
  const studyTitle = document.getElementById('studyTitle');
  const instructionContainer = document.getElementById('instructionContainer');

  // Set the study title
  document.title = studyConfig.title;
  studyTitle.textContent = studyConfig.title;

  // Create an "End Study" button
  const endStudyButton = document.createElement('button');
  endStudyButton.innerText = 'End Study';
  endStudyButton.classList.add('end-study-button');
  endStudyButton.addEventListener('click', endStudy);
  studyTitle.insertAdjacentElement('afterend', endStudyButton);

  // Mapping from root videos to their derivatives
  const videoMapping = {};
  videoFilenames.forEach(videoGroup => {
    videoMapping[videoGroup.root_video] = videoGroup.derivatives;
  });

  // Function to get targeted shape from derivative video filename
  function getTargetedShapeFromFilename(filename) {
    const nameWithoutExtension = filename.split('/').pop().split('.mp4')[0];
    const parts = nameWithoutExtension.split('-');
    if (parts.length >= 2) {
      const targetedShapePart = parts[1];
      if (targetedShapePart.includes('btriangle')) {
        return 'BigTriangle';
      } else if (targetedShapePart.includes('striangle')) {
        return 'SmallTriangle';
      } else if (targetedShapePart.includes('circle')) {
        return 'Circle';
      } else if (targetedShapePart.includes('rectangle')) {
        return 'Rectangle';
      }
    }
    return null;
  }

  // Sequence of shapes
  const shapesSequence = ['BigTriangle', 'SmallTriangle', 'Circle', 'Rectangle'];

  // Function to parse video filenames and extract shape configurations
  function shapesInVideo(filename) {
    // Remove the path and file extension
    const nameWithoutExtension = filename.split('/').pop().split('.mp4')[0];

    // Split the name by underscores
    const parts = nameWithoutExtension.split('-');

    // Initialize shapes with the rectangle (assumed present)
    const shapes = [];

    // Iterate over parts to find shape codes
    parts.forEach(part => {
      // Iterate over each character in the part
      for (let char of part) {
        if (char === 'T') {
          shapes.push('Triangle');
        } else if (char === 'C') {
          shapes.push('Circle');
        }
      }
    });
    shapes.push('Rectangle');

    return shapes;
  }

  // Function to load and play videos
  function loadAndPlayVideo() {
    const videoData = studyConfig.videoSequence[currentVideoIndex];
    // Reset videoEnded for the new video
    videoEnded = false;
    // Clear previous content
    videoContainer.innerHTML = '';
    instructionContainer.style.display = 'none';
    questionnaireContainer.innerHTML = '';
    questionnaireContainer.style.display = 'none';

    if (videoData.type === 'sideBySide') {
      // Handle side-by-side videos
      const sideBySideContainer = document.createElement('div');
      sideBySideContainer.classList.add('side-by-side-container');

      videoData.src.forEach((src, index) => { 
        const videoElement = document.createElement('video');
        videoElement.setAttribute('src', src);
        videoElement.setAttribute('controls', true);
        videoElement.setAttribute('id', `video${index}`);
        videoElement.style.width = '48%';
        videoElement.style.marginRight = '2%';
        sideBySideContainer.appendChild(videoElement);

        // Add event listener to each video
        videoElement.addEventListener('ended', checkBothVideosEnded);
      });

      videoContainer.appendChild(sideBySideContainer);

      // Function to check if both videos have ended
      function checkBothVideosEnded() {
        const videos = sideBySideContainer.querySelectorAll('video');
        const allEnded = Array.from(videos).every(video => video.ended);

        if (allEnded && !videoEnded) {
          videoEnded = true;
          displayTextQuestions(videoData);
        }
      }
    } else {
      const shapestoDisplay = shapesInVideo(videoData.src);
      videoData.shapes = shapestoDisplay;

      // Get the root video and its derivatives
      const rootVideoSrc = videoData.src;
      const derivatives = videoMapping[rootVideoSrc] || [];

      // Create mapping from shapes to derivative video srcs
      const derivativeVideosByShape = {};
      derivatives.forEach(derivativeVideoSrc => {
        const shape = getTargetedShapeFromFilename(derivativeVideoSrc);
        if (shape) {
          derivativeVideosByShape[shape] = derivativeVideoSrc;
        }
      });

      // Store derivativeVideosByShape in videoData for later use
      videoData.derivativeVideosByShape = derivativeVideosByShape;

      // Load and play the root video
      const videoElement = document.createElement('video');
      videoElement.setAttribute('src', videoData.src);
      videoElement.setAttribute('controls', true);
      videoElement.setAttribute('id', 'studyVideo');
      videoElement.style.width = '60%';

      videoContainer.appendChild(videoElement);

      // Add event listener to video to display questionnaire when ended
      videoElement.addEventListener('ended', () => {
        // Display text questions first
        displayTextQuestions(videoData);
      });
    }
  }

  function displayTextQuestions(videoData) {
    // Filter text questions
    const textQuestions = videoData.questions.filter(q => q.type === 'text');

    let questionIndex = 0;

    function displayNextTextQuestion() {
      if (questionIndex >= textQuestions.length && videoData.type === 'single') {
        // After text questions, process shapes
        processShapesForVideo(videoData);
        return;
      }
      else if (questionIndex >= textQuestions.length && videoData.type === 'sideBySide') {
        // Check for additional questions
        const additionalQuestions = videoData.questions.filter(q => q.type !== 'text');
        if (additionalQuestions.length > 0) {
          console.log('additionalQuestions remaining', additionalQuestions);
          // Proceed to additional questions
          displayAdditionalQuestionsForSideBySide(videoData, additionalQuestions,console.log('displaying additional q function'), () => {
            // After all questions are done, proceed to the next video or end the study
            currentVideoIndex++;
            if (currentVideoIndex < studyConfig.videoSequence.length) {
              console.log('load and play another video');
              loadAndPlayVideo();
            } else {
              console.log('end study function');
              endStudy();
            }
          });
        } else {
          // No additional questions, proceed to next video or end study
          currentVideoIndex++;
          if (currentVideoIndex < studyConfig.videoSequence.length) {
            loadAndPlayVideo();
          } else {
            endStudy();
          }
        }
        return;
      }

      const question = textQuestions[questionIndex];
      const shapeToShownow = videoData.type === 'sideBySide' ? null : videoData.shapes[0];

      displayQuestionnaire(question, shapeToShownow, null, null, () => {
        // After submitting the answer, move to the next question
        currentQuestionIndex++;
        questionIndex++;
        displayNextTextQuestion();
      }, videoData);
    }

    displayNextTextQuestion();
  }

  // Function to display additional questions for side-by-side videos
  function displayAdditionalQuestionsForSideBySide(videoData, questions, callback) {
    let questionIndex = 0;

    function displayNextQuestion() {
      if (questionIndex >= questions.length) {
        // All additional questions are done
        callback();
        return;
      }

      const question = questions[questionIndex];

      displayQuestionnaire(question, null, null, null, () => {
        // After submitting the answer, move to the next question
        currentQuestionIndex++;
        questionIndex++;
        displayNextQuestion();
      }, videoData);
    }

    displayNextQuestion();
  }

  // Function to process shapes for the current video
  function processShapesForVideo(videoData) {
    const derivativeVideosByShape = videoData.derivativeVideosByShape;
    let currentShapeIndex = 0;

    function processCurrentShape() {
      if (currentShapeIndex >= shapesSequence.length) {
        // All shapes processed, move to next video
        currentVideoIndex++;
        if (currentVideoIndex < studyConfig.videoSequence.length) {
          loadAndPlayVideo();
        } else {
          endStudy();
        }
        return;
      }

      const currentShape = shapesSequence[currentShapeIndex];
      const derivativeVideoSrc = derivativeVideosByShape[currentShape];

      // Display the derivative video
      if (derivativeVideoSrc) {
        // Clear previous content
        videoContainer.innerHTML = '';
        instructionContainer.style.display = 'none';
        questionnaireContainer.innerHTML = '';
        questionnaireContainer.style.display = 'none';

        const videoElement = document.createElement('video');
        videoElement.setAttribute('src', derivativeVideoSrc);
        videoElement.setAttribute('controls', true);
        videoElement.style.width = '60%';
        videoContainer.appendChild(videoElement);
      }

      // Display the derivative video along with the questionnaire
      displayQuestionsForShape(videoData, currentShape, currentShapeIndex, derivativeVideoSrc, () => {
        currentShapeIndex++;
        processCurrentShape();
      });
    }

    processCurrentShape();
  }

  // Function to display questions for a shape
  function displayQuestionsForShape(videoData, currentShape, currentShapeIndex, derivativeVideoSrc, callback) {
    // Filter questions relevant to the current shape
    const shapeQuestions = videoData.questions.filter(
      q => q.type === 'multiple_selection' || q.type === 'godspeed'
    );

    let questionIndex = 0;

    function displayNextQuestion() {
      if (questionIndex >= shapeQuestions.length) {
        // All questions for this shape are done
        callback();
        return;
      }
      const question = shapeQuestions[questionIndex];
      const shapeToShownow = videoData.shapes[currentShapeIndex];

      displayQuestionnaire(question, shapeToShownow, currentShape, derivativeVideoSrc, () => {
        // After submitting the answer, move to the next question
        currentQuestionIndex++;
        questionIndex++;
        displayNextQuestion();
      }, videoData);
    }

    displayNextQuestion();
  }

  // Function to display questionnaire
  function displayQuestionnaire(question, shapeToShownow, currentShape, derivativeVideoSrc, callback, videoData) {
    questionnaireContainer.style.display = 'block';
    questionnaireContainer.innerHTML = '';

    const form = document.createElement('form');
    form.setAttribute('id', 'questionnaireForm');

    const questionWrapper = document.createElement('div');
    questionWrapper.classList.add('question');

    // Display instruction and derivative video if needed
    if ((question.type === 'godspeed' || question.type === 'multiple_selection') && currentShape) {
      instructionContainer.style.display = 'block';
      instructionContainer.innerHTML = '';

      const shapeInstruction = document.createElement('div');
      shapeInstruction.classList.add('shape-instruction');

      const shapeImage = document.createElement('img');
      shapeImage.setAttribute('id', 'shapeImage');
      shapeImage.setAttribute('src', `./resources/images/${shapeToShownow.toLowerCase()}.png`);
      shapeImage.setAttribute('alt', `${shapeToShownow} shape`);

      const shapeText = document.createElement('p');
      shapeText.textContent = 'Please note: All the following questions should be answered by focusing specifically on the actions of the shape on the left, highlighted in blue, as it appears in the video';

      shapeInstruction.appendChild(shapeImage);
      shapeInstruction.appendChild(shapeText);

      instructionContainer.appendChild(shapeInstruction);
    } else {
      instructionContainer.style.display = 'none';
    }

    const questionLabel = document.createElement('label');
    questionLabel.setAttribute('for', `q${currentQuestionIndex}`);
    questionLabel.innerText = question.text;
    questionWrapper.appendChild(questionLabel);

    let inputElement = null;

    switch (question.type) {
      case 'text':
        inputElement = document.createElement('textarea');
        inputElement.setAttribute('id', `q${currentQuestionIndex}`);
        inputElement.setAttribute('name', `q${currentQuestionIndex}`);
        inputElement.setAttribute('rows', '4');
        inputElement.setAttribute('cols', '50');
        inputElement.required = true;
        break;

      case 'multiple_selection':
        inputElement = document.createElement('div');
        inputElement.classList.add('multiple-selection-container');
        const questionText = document.createElement('p');
        questionText.classList.add('multiple-selection-option');

        question.options.forEach((option, index) => {
          const optionLabel = document.createElement('label');
          optionLabel.classList.add('multiple-selection-option');

          const checkboxInput = document.createElement('input');
          checkboxInput.type = 'checkbox';
          checkboxInput.name = `q${currentQuestionIndex}`;
          checkboxInput.value = option;
          checkboxInput.setAttribute('data-option-index', index);

          optionLabel.appendChild(checkboxInput);
          optionLabel.appendChild(document.createTextNode(option));
          optionLabel.appendChild(questionText);
          inputElement.appendChild(optionLabel);

          if (option === 'Add other element not listed') {
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.setAttribute('name', `q${currentQuestionIndex}_other`);
            textInput.placeholder = 'Please specify';
            textInput.style.display = 'none';
            textInput.required = false;

            checkboxInput.addEventListener('change', () => {
              if (checkboxInput.checked) {
                textInput.style.display = 'block';
                textInput.required = true;
              } else {
                textInput.style.display = 'none';
                textInput.required = false;
              }
            });

            inputElement.appendChild(textInput);
          }
        });
        break;

      case 'godspeed':
        inputElement = document.createElement('div');
        inputElement.classList.add('godspeed-container');

        const godspeedQuestionElement = document.createElement('div');
        godspeedQuestionElement.classList.add('godspeed-question');

        const [leftLabel, rightLabel] = question.text.split(' vs. ');

        const scaleContainer = document.createElement('div');
        scaleContainer.classList.add('godspeed-scale-container');

        const leftLabelElement = document.createElement('span');
        leftLabelElement.classList.add('godspeed-label', 'left-label');
        leftLabelElement.innerText = leftLabel;

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('godspeed-options');

        question.options.forEach(option => {
          const optionLabel = document.createElement('label');
          optionLabel.classList.add('godspeed-option');

          const radioInput = document.createElement('input');
          radioInput.type = 'radio';
          radioInput.name = `q${currentQuestionIndex}`;
          radioInput.value = option;
          radioInput.required = true;

          optionLabel.appendChild(radioInput);
          optionLabel.appendChild(document.createTextNode(option));
          optionsContainer.appendChild(optionLabel);
        });

        const rightLabelElement = document.createElement('span');
        rightLabelElement.classList.add('godspeed-label', 'right-label');
        rightLabelElement.innerText = rightLabel;

        scaleContainer.appendChild(leftLabelElement);
        scaleContainer.appendChild(optionsContainer);
        scaleContainer.appendChild(rightLabelElement);

        godspeedQuestionElement.appendChild(scaleContainer);

        inputElement.appendChild(godspeedQuestionElement);
        break;

      default:
        console.error(`Unknown question type: ${question.type}`);
        return;
    }

    if (inputElement) {
      questionWrapper.appendChild(inputElement);
    }

    form.appendChild(questionWrapper);

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.innerText = 'Next';
    form.appendChild(submitButton);

    form.addEventListener('submit', event => {
      if (question.type === 'multiple_selection') {
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        let isChecked = false;

        checkboxes.forEach((checkbox) => {
          if (checkbox.checked) {
            isChecked = true;
          }
        });

        if (!isChecked) {
          alert('Please select at least one option before proceeding.');
          event.preventDefault(); // Prevent form submission
          return;
        }
      }

      // Pass videoData to handleSubmit
      handleSubmit(event, question, currentShape, videoData, callback);
    });

    questionnaireContainer.appendChild(form);
  }

  // Function to handle form submission
  function handleSubmit(event, question, currentShape, videoData, callback) {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Remove this line since videoData is passed as a parameter
    // const videoData = studyConfig.videoSequence[currentVideoIndex-1];

    // Initialize the response object for the current video and shape
    if (!responses[currentVideoIndex]) {
      responses[currentVideoIndex] = {
        videoId: videoData.id,
        videoName: videoData.src,
        shapesDistribution: videoData.shapes,
        shapes: {},
        answers: {}
      };
    }

    // Save the current question's answer
    let answer;
    const key = `q${currentQuestionIndex}`;

    if (question.type === 'multiple_selection') {
      answer = formData.getAll(key);
    } else {
      answer = formData.get(key);
    }
    const responseEntry = {
      questionText: question.text,
      answer: answer,
      ...(question.dimension && { dimension: question.dimension })
    };

    if (currentShape) {
      if (!responses[currentVideoIndex].shapes[currentShape]) {
        responses[currentVideoIndex].shapes[currentShape] = {
          answers: {}
        };
      }
      responses[currentVideoIndex].shapes[currentShape].answers[key] = responseEntry;
    } else {
      responses[currentVideoIndex].answers[key] = responseEntry;
    }

    // Handle additional input for "Add other element not listed"
    const otherInputKey = `${key}_other`;
    if (formData.has(otherInputKey)) {
      const otherValue = formData.get(otherInputKey);
      if (otherValue.trim() !== '') {
        const otherResponseEntry = {
          questionText: 'Additional input for other element',
          answer: otherValue
        };

        if (currentShape) {
          responses[currentVideoIndex].shapes[currentShape].answers[otherInputKey] = otherResponseEntry;
        } else {
          responses[currentVideoIndex].answers[otherInputKey] = otherResponseEntry;
        }
      }
    }

    // Proceed to the next question via callback
    callback();
  }

  // Function to end the study and prepare data for download
  function endStudy() {
    // Prepare data for download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(responses, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "study_responses.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    // Redirect to end page
    window.location.href = studyConfig.endPage;
  }

  // Start the study
  loadAndPlayVideo();
});
