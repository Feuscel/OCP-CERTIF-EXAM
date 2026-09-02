---
id: "jc-optional"
title: "Java21DocCards - Optional"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["optional", "null-safety"]
questions:
  - id: "jc-optional-001"
    title_fr: "What does the following code return?\n```java\nimport java.util.*;\nclass Family {\n  public static void main(String[] args){\n    Optional<String> dad = Optional.ofNullable(null);\n    System.out.println(dad.orElse(\"Unknown\"));\n  }\n}\n```"
    title_en: "What does the following code return?\n```java\nimport java.util.*;\nclass Family {\n  public static void main(String[] args){\n    Optional<String> dad = Optional.ofNullable(null);\n    System.out.println(dad.orElse(\"Unknown\"));\n  }\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Compilation error"
        text_en: "Compilation error"
      - label: "B"
        text_fr: "Unknown"
        text_en: "Unknown"
      - label: "C"
        text_fr: "Throws NullPointerException"
        text_en: "Throws NullPointerException"
      - label: "D"
        text_fr: "null"
        text_en: "null"
    correct_answers: ["B"]
    explanation_fr: "ofNullable(null) creates empty Optional. orElse supplies fallback."
    explanation_en: "ofNullable(null) creates empty Optional. orElse supplies fallback."
---

Java21DocCards - Optional questions.