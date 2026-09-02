---
id: "jc-enums"
title: "Java21DocCards - Enums"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["enums", "constants"]
questions:
  - id: "jc-enums-001"
    title_fr: "What is the output of this family enum hierarchy code?"
    title_en: "What is the output of this family enum hierarchy code?"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Hey 2 -2 3"
        text_en: "Hey 2 -2 3"
      - label: "B"
        text_fr: "Hi there 2 2 3"
        text_en: "Hi there 2 2 3"
      - label: "C"
        text_fr: "Hey 1 -1 3"
        text_en: "Hey 1 -1 3"
      - label: "D"
        text_fr: "Hi there 2 -2 3"
        text_en: "Hi there 2 -2 3"
      - label: "E"
        text_fr: "Compilation error"
        text_en: "Compilation error"
    correct_answers: ["D"]
    explanation_fr: "roles[1] is PARENT which overrides getGreeting() to return 'Hi there'. found is CHILD with ordinal 2. GRANDPARENT.compareTo(CHILD) compares ordinals: 0 - 2 = -2. values() returns array of length 3."
    explanation_en: "roles[1] is PARENT which overrides getGreeting() to return 'Hi there'. found is CHILD with ordinal 2. GRANDPARENT.compareTo(CHILD) compares ordinals: 0 - 2 = -2. values() returns array of length 3."
---

Java21DocCards - Enums questions.