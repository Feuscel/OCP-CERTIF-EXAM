---
id: "jc-arrays"
title: "Java21DocCards - Arrays"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["arrays", "data-structures"]
questions:
  - id: "jc-arrays-001"
    title_fr: "Which value is returned by Arrays.binarySearch when the key is absent?\n```java\nclass Family {\n    public static void main(String[] args) {\n        int[] arr = {10,20,30};\n        int pos = java.util.Arrays.binarySearch(arr,25);\n        System.out.println(pos);\n    }\n}\n```"
    title_en: "Which value is returned by Arrays.binarySearch when the key is absent?\n```java\nclass Family {\n    public static void main(String[] args) {\n        int[] arr = {10,20,30};\n        int pos = java.util.Arrays.binarySearch(arr,25);\n        System.out.println(pos);\n    }\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "2"
        text_en: "2"
      - label: "B"
        text_fr: "-3"
        text_en: "-3"
      - label: "C"
        text_fr: "-2"
        text_en: "-2"
      - label: "D"
        text_fr: "Compilation error"
        text_en: "Compilation error"
    correct_answers: ["B"]
    explanation_fr: "Not found → returns -(insertion point) - 1. 25 would be at index 2 → -(2)-1 = -3."
    explanation_en: "Not found → returns -(insertion point) - 1. 25 would be at index 2 → -(2)-1 = -3."
---

Java21DocCards - Arrays questions.