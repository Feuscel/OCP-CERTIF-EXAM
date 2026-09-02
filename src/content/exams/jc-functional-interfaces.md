---
id: "jc-functional-interfaces"
title: "Java21DocCards - Functional Interfaces"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["functional-interfaces", "predicate", "function", "consumer"]
questions:
  - id: "jc-functional-interfaces-001"
    title_fr: "What is the output of this family filtering operation using predicate composition?"
    title_en: "What is the output of this family filtering operation using predicate composition?"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "0"
        text_en: "0"
      - label: "B"
        text_fr: "1"
        text_en: "1"
      - label: "C"
        text_fr: "2"
        text_en: "2"
      - label: "D"
        text_fr: "3"
        text_en: "3"
      - label: "E"
        text_fr: "5"
        text_en: "5"
    correct_answers: ["B"]
    explanation_fr: "isAdult.negate() filters for members under 18, which gives us only [Son]. The map(getRole) transforms Son to 'NonParent' since Son.isParent is false. The final filter keeps only 'NonParent' strings, so count() returns 1."
    explanation_en: "isAdult.negate() filters for members under 18, which gives us only [Son]. The map(getRole) transforms Son to 'NonParent' since Son.isParent is false. The final filter keeps only 'NonParent' strings, so count() returns 1."
---

Java21DocCards - Functional Interfaces questions.