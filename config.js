const studyConfig = {
  videoSequence: [
    {
      id: "video1",
      src: "resources/videos/scenes/processed_scene_1.mp4",
      questions: [
        "Please provide in the form of a story a brief description of the events displayed in the video.",
        "Please describe the role of the actors in the video.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "If you were to recreate the scene, what would be the key elements to alter or retain in order to elicit responses from other participants similar to the ones you provided for Q1?",
        "Are you satisfied with all your answers?"
      ]
    },
    {
      id: "video4",
      src: "resources/videos/scenes/processed_scene_4.mp4",
      questions: [
        "Please provide in the form of a story a brief description of the events displayed in the video.",
        "Please describe the role of the actors in the video.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "If you were to recreate the scene, what would be the key elements to alter or retain in order to elicit responses from other participants similar to the ones you provided for Q1?",
        "Are you satisfied with all your answers?"
      ]
    },
    {
      id: "video5",
      type: "sideBySide",
      src: [
        "resources/videos/scenes/processed_scene_3.mp4",
        "resources/videos/scenes/processed_scene_4.mp4"
      ],
      questions: [
        "Please provide in the form of a story a brief description of the events displayed in the videos.",
        "Please describe the role of the actors in the videos.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "If you were to recreate the scenes, what would be the key elements to alter or retain in order to elicit responses from other participants similar to the ones you provided for Q1?",
        "Are you satisfied with all your answers?"
      ]
    }
  ],
  questionOptions: {
    q4: [
      "Velocity of movements",
      "Proximity between actors",
      "Actor's colour",
      "Actor's size",
      "Actor's shape",
      "Add other element not listed"
    ]
  },
  nextPage: "download.html",
  endPage: "end.html",
  title: "Please watch the video and answer the questions that follow."
};