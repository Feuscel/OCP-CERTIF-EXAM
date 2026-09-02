---
id: "jc-control-flow"
title: "Java21DocCards - Control Flow"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["control-flow", "loops", "conditionals"]
questions:
  - id: "jc-control-flow-001"
    title_fr: "Which sequence prints in a for-loop with initialization side-effect?\n```java\nclass Family {\n    public static void main(String[] args) {\n        int i = 0;\n        for(System.out.print(\"Dad\"); i < 2; i++) {\n            System.out.print(\"Son\");\n        }\n    }\n}\n```"
    title_en: "Which sequence prints in a for-loop with initialization side-effect?\n```java\nclass Family {\n    public static void main(String[] args) {\n        int i = 0;\n        for(System.out.print(\"Dad\"); i < 2; i++) {\n            System.out.print(\"Son\");\n        }\n    }\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "DadSon"
        text_en: "DadSon"
      - label: "B"
        text_fr: "DadSonSon"
        text_en: "DadSonSon"
      - label: "C"
        text_fr: "SonDadSon"
        text_en: "SonDadSon"
      - label: "D"
        text_fr: "Compilation error"
        text_en: "Compilation error"
    correct_answers: ["B"]
    explanation_fr: "Init prints Dad once. Loop runs twice printing Son Son."
    explanation_en: "Init prints Dad once. Loop runs twice printing Son Son."
---

Java21DocCards - Control Flow questions.