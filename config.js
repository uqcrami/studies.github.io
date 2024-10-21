// Define naming conventions for video filenames
// bt_st_c-shapeColoured_colour_angle_fRate_scene
const videoFilenames = [
  {
    root_video: "resources/videos/scenes/TCC-allBlacks-blue_30_3_p1.mp4",
    derivatives: [
      "resources/videos/scenes/TCC-btriangle-blue_30_3_p1.mp4",
      "resources/videos/scenes/TCC-striangle-blue_30_3_p1.mp4",
      "resources/videos/scenes/TCC-circle-blue_30_3_p1.mp4",
      "resources/videos/scenes/TCC-rectangle-blue_30_3_p1.mp4"
    ]
  },
  {
    root_video: "resources/videos/scenes/TCC-allBlacks-blue_1_3_p1.mp4",
    derivatives: [
      "resources/videos/scenes/TCC-btriangle-blue_1_3_p1.mp4",
      "resources/videos/scenes/TCC-striangle-blue_1_3_p1.mp4",
      "resources/videos/scenes/TCC-circle-blue_1_3_p1.mp4",
      "resources/videos/scenes/TCC-rectangle-blue_1_3_p1.mp4"
    ]
  },
  {
    root_video: "resources/videos/scenes/TCC-allBlacks-blue_30_3_p3.mp4",
    derivatives: [
      "resources/videos/scenes/TCC-btriangle-blue_30_3_p3.mp4",
      "resources/videos/scenes/TCC-striangle-blue_30_3_p3.mp4",
      "resources/videos/scenes/TCC-circle-blue_30_3_p3.mp4",
      "resources/videos/scenes/TCC-rectangle-blue_30_3_p3.mp4"
    ]
  },
  {
    root_video: "resources/videos/scenes/TCC-allBlacks-blue_1_3_p3.mp4",
    derivatives: [
      "resources/videos/scenes/TCC-btriangle-blue_1_3_p3.mp4",
      "resources/videos/scenes/TCC-striangle-blue_1_3_p3.mp4",
      "resources/videos/scenes/TCC-circle-blue_1_3_p3.mp4",
      "resources/videos/scenes/TCC-rectangle-blue_1_3_p3.mp4"
    ]
  }
];

// Define the shared options for Godspeed questions (Likert scale)
const godspeedOptions = ["1", "2", "3", "4", "5"];

const dofex_question_options = [
  "Velocity of movements",
  "Proximity to others",
  "Colour",
  "Size",
  "Shape",
  "Add other element not listed"
];

// Function to create a Godspeed question object
function createGodspeedQuestion(text, dimension) {
  return {
    text: text,
    type: "godspeed",
    dimension: dimension,
    options: godspeedOptions
  };
}

// Define the Godspeed Questionnaire dimensions and their questions
const godspeedDimensions = {
  "Anthropomorphism": [
  //   "Fake vs. Natural",
  //   "Machinelike vs. Humanlike",
  //   "Unconscious vs. Conscious",
  //   "Artificial vs. Lifelike",
  //   "Moving rigidly vs. Moving elegantly"
  // ],
  // "Animacy": [
  //   "Dead vs. Alive",
  //   "Stagnant vs. Lively",
  //   "Mechanical vs. Organic",
  //   "Artificial vs. Lifelike",
  //   "Inert vs. Interactive",
  //   "Apathetic vs. Responsive"
  // ],
  // "Likeability": [
  //   "Dislike vs. Like",
  //   "Unfriendly vs. Friendly",
  //   "Unkind vs. Kind",
  //   "Unpleasant vs. Pleasant",
    "Awful vs. Nice"
  ]
};

// Generate the Godspeed questions using the function and dimensions
const godspeedQuestions = [];

for (const [dimension, questions] of Object.entries(godspeedDimensions)) {
  questions.forEach(questionText => {
    godspeedQuestions.push(createGodspeedQuestion(questionText, dimension));
  });
}

// Define the main questionnaire (used after single videos)
const mainQuestionnaire = [
  {
    text: "Please describe what you observed in the video.",
    type: "text"
  },
  {
    text: "From the description you provided in Q1, Which specific expressions or actions of the blue shape influenced your response? please select or add as many options as necessary using the 'other' option.",
    type: "multiple_selection",
    options: dofex_question_options
  },
  // Include the Godspeed Questionnaire items
  ...godspeedQuestions
];

// Define the short questionnaire (used after side-by-side videos)
const shortQuestionnaire = [
  {
    text: "Are the videos the same or different?",
    type: "text"
  },
  {
    text: "Please describe the differences or similarities between the videos.",
    type: "text"
  }
  // Add more questions to shortQuestionnaire if needed
];

// Organize the videoSequence to match the desired flow
const studyConfig = {
  title: "Please watch the videos and answer the questions that follow.",
  endPage: "end.html",
  videoSequence: [
    {
      id: "video1",
      type: "single",
      src: videoFilenames[0].root_video,
      // shapes will be parsed in VideoPlayer.js
      
      questions: mainQuestionnaire
    },
    {
      id: "video2",
      type: "single",
      src: videoFilenames[1].root_video,
      questions: mainQuestionnaire
    },
    {
      id: "video1and2",
      type: "sideBySide",
      src: [
        videoFilenames[0].root_video,
        videoFilenames[1].root_video
      ],
      questions: shortQuestionnaire
    },
    {
      id: "video3",
      type: "single",
      src: videoFilenames[2].root_video,
      // shapes will be parsed in VideoPlayer.js
      
      questions: mainQuestionnaire
    },
    {
      id: "video4",
      type: "single",
      src: videoFilenames[3].root_video,
      questions: mainQuestionnaire
    },
    {
      id: "video3and4",
      type: "sideBySide",
      src: [
        videoFilenames[2].root_video,
        videoFilenames[3].root_video
      ],
      questions: shortQuestionnaire
    }
  ]
};

// Attach to window object for global access
window.studyConfig = studyConfig;
window.videoFilenames = videoFilenames; // Expose videoFilenames to VideoPlayer.js
