---
id: "jc-operators"
title: "Java21DocCards - Operators"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["operators", "boolean", "arithmetic"]
questions:
  - id: "jc-operators-001"
    title_fr: "What is the output of this family membership code?\n```java\nvar isMother = false;\nvar isFather = false;\nif (isFather = isMother != isFather) {\n    System.out.println(\"You are part of the family!\");\n} else {\n    System.out.println(\"You are not part of the family!\");\n}\n```"
    title_en: "What is the output of this family membership code?\n```java\nvar isMother = false;\nvar isFather = false;\nif (isFather = isMother != isFather) {\n    System.out.println(\"You are part of the family!\");\n} else {\n    System.out.println(\"You are not part of the family!\");\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "You are part of the family!"
        text_en: "You are part of the family!"
      - label: "B"
        text_fr: "You are not part of the family!"
        text_en: "You are not part of the family!"
      - label: "C"
        text_fr: "Compilation error"
        text_en: "Compilation error"
      - label: "D"
        text_fr: "Runtime exception"
        text_en: "Runtime exception"
      - label: "E"
        text_fr: "Unreachable code error"
        text_en: "Unreachable code error"
    correct_answers: ["B"]
    explanation_fr: "The expression 'isFather = isMother != isFather' is evaluated as 'isFather = (isMother != isFather)'. Since isMother is false and isFather is false, (false != false) evaluates to false. However, this false value is then assigned to isFather, and the assignment expression returns the assigned value (false). The if condition gets false, so it goes to else and prints 'You are not part of the family!'."
    explanation_en: "The expression 'isFather = isMother != isFather' is evaluated as 'isFather = (isMother != isFather)'. Since isMother is false and isFather is false, (false != false) evaluates to false. However, this false value is then assigned to isFather, and the assignment expression returns the assigned value (false). The if condition gets false, so it goes to else and prints 'You are not part of the family!'."
  - id: "jc-operators-002"
    title_fr: "What will this code print?\n```java\nclass Family {\n    public static void main(String[] args) {\n        String s = null;\n        System.out.println(s instanceof String);\n    }\n}\n```"
    title_en: "What will this code print?\n```java\nclass Family {\n    public static void main(String[] args) {\n        String s = null;\n        System.out.println(s instanceof String);\n    }\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "true"
        text_en: "true"
      - label: "B"
        text_fr: "false"
        text_en: "false"
      - label: "C"
        text_fr: "Compilation error"
        text_en: "Compilation error"
      - label: "D"
        text_fr: "Throws exception"
        text_en: "Throws exception"
      - label: "E"
        text_fr: "Nothing is printed"
        text_en: "Nothing is printed"
    correct_answers: ["B"]
    explanation_fr: "instanceof returns false when the reference is null."
    explanation_en: "instanceof returns false when the reference is null."
---

Java21DocCards - Operators questions.