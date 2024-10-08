const studyConfig = {
  videoSequence: [
    {
      id: "video5",
      src: "resources/videos/scenes/AC_sp_w_30_3_p5.mp4",
      questions: [
        "Please describe what you observed in the video.",
        "Please describe what the actors do and their role in the video.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "If you were to recreate the scene shown in the video, what would be the key elements to mantain or change in order to elicit responses from other participants similar to the ones you provided for Q1?",
        "Are you satisfied with all your answers?"
      ]
    },
    {
      id: "video6",
      src: "resources/videos/scenes/AC_sp_w_30_10_p5.mp4",
      questions: [
        "Please describe what you observed in the video.",
        "Please describe what the actors do and their role in the video.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "If you were to recreate the scene shown in the video, what would be the key elements to mantain or change in order to elicit responses from other participants similar to the ones you provided for Q1?",
        "Are you satisfied with all your answers?"
      ]
    },
    {
      id: "video56",
      type: "sideBySide",
      src: [
        "resources/videos/scenes/AC_sp_w_30_3_p5.mp4",
        "resources/videos/scenes/AC_sp_w_30_10_p5.mp4"
      ],
      questions: [
        "Are the videos the same or different?",
        "if they are different, please describe the differences, otherwise please describe the similarities.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "What is the single element that would need to be changed to make the videos different from each other?",
        "Are you satisfied with all your answers?"
      ]
    },
    {
      id: "video7",
      src: "resources/videos/scenes/bigT_spinning_whole_time_3_p1.mp4",
      questions: [
        "Please describe what you observed in the video.",
        "Please describe what the actors do and their role in the video.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "If you were to recreate the scene shown in the video, what would be the key elements to mantain or change in order to elicit responses from other participants similar to the ones you provided for Q1?",
        "Are you satisfied with all your answers?"
      ]
    },
    {
      id: "video8",
      src: "resources/videos/scenes/bT_sp_w_10_10_p1.mp4",
      questions: [
        "Please describe what you observed in the video.",
        "Please describe what the actors do and their role in the video.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "If you were to recreate the scene shown in the video, what would be the key elements to mantain or change in order to elicit responses from other participants similar to the ones you provided for Q1?",
        "Are you satisfied with all your answers?"
      ]
    },
    {
      id: "video78",
      type: "sideBySide",
      src: [
        "resources/videos/scenes/bigT_spinning_whole_time_3_p1.mp4",
        "resources/videos/scenes/bT_sp_w_10_10_p1.mp4"
      ],
      questions: [
        "Are the videos the same or different?",
        "if they are different, please describe the differences, otherwise please describe the similarities.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "What is the single element that would need to be changed to make the videos different from each other?",
        "Are you satisfied with all your answers?"
      ]
    },
    {
      id: "video9",
      src: "resources/videos/scenes/Heider_and_Simmel_oirginal_p4.mp4",
      questions: [
        "Please describe what you observed in the video.",
        "Please describe what the actors do and their role in the video.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "If you were to recreate the scene shown in the video, what would be the key elements to mantain or change in order to elicit responses from other participants similar to the ones you provided for Q1?",
        "Are you satisfied with all your answers?"
      ]
    },
    {
      id: "video10",
      src: "resources/videos/scenes/2T_sp_w_30_10_p4.mp4",
      questions: [
        "Please describe what you observed in the video.",
        "Please describe what the actors do and their role in the video.",
        "From Q2, Which specific expressions or actions had the greatest influence on your response?",
        "If you were to recreate the scene shown in the video, what would be the key elements to mantain or change in order to elicit responses from other participants similar to the ones you provided for Q1?",
        "Are you satisfied with all your answers?"
      ]
    },
    {
      id: "video910",
      type: "sideBySide",
      src: [
        "resources/videos/scenes/Heider_and_Simmel_oirginal_p4.mp4",
        "resources/videos/scenes/2T_sp_w_30_10_p4.mp4"
      ],
      questions: [
        "Are the videos the same or different?",
        "From Q1, Which specific expressions or actions from each shape influenced your response, please add or select as many as necessary?",
        "Please rate your impression of each shape on these scales",
        "Please rate your impression of each shape on these scales",
        "Please rate your impression of each shape on these scales?"
      ]
    }
  ],
  questionOptions: {
    q4: [
      "Velocity of movements",
      "Proximity to others",
      "Colour",
      "Size",
      "Shape",
      "Add other element not listed"
    ]
  },
  nextPage: "download.html",
  endPage: "end.html",
  title: "Please watch the video and answer the questions that follow."
};