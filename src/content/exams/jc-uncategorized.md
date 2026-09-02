---
id: "jc-uncategorized"
title: "Java21DocCards - Uncategorized"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["uncategorized"]
questions:
  - id: "jc-uncategorized-001"
    title_fr: "Which of the following statements is invalid Java syntax for creating an array of Integers?"
    title_en: "Which of the following statements is invalid Java syntax for creating an array of Integers?"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Integer[] arr = {1, 2, 3};"
        text_en: "Integer[] arr = {1, 2, 3};"
      - label: "B"
        text_fr: "Integer[] arr = new Integer[3];"
        text_en: "Integer[] arr = new Integer[3];"
      - label: "C"
        text_fr: "var[] arr = {1, 2, 3};"
        text_en: "var[] arr = {1, 2, 3};"
      - label: "D"
        text_fr: "Integer[] arr = new Integer[]{1, 2, 3};"
        text_en: "Integer[] arr = new Integer[]{1, 2, 3};"
      - label: "E"
        text_fr: "Integer arr[] = {1, 2, 3};"
        text_en: "Integer arr[] = {1, 2, 3};"
    correct_answers: ["C"]
    explanation_fr: "Only option 3 ('var[] arr = {1, 2, 3};') is invalid Java syntax. Java does not allow 'var[]' for array declarations with initializers. All other options are valid ways to declare and initialize an Integer array."
    explanation_en: "Only option 3 ('var[] arr = {1, 2, 3};') is invalid Java syntax. Java does not allow 'var[]' for array declarations with initializers. All other options are valid ways to declare and initialize an Integer array."
  - id: "jc-uncategorized-002"
    title_fr: "Which statement about virtual threads in Java is correct?"
    title_en: "Which statement about virtual threads in Java is correct?"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Virtual threads are managed by the operating system and use native OS threads."
        text_en: "Virtual threads are managed by the operating system and use native OS threads."
      - label: "B"
        text_fr: "Virtual threads allow high concurrency with minimal resource usage by being managed by the JVM."
        text_en: "Virtual threads allow high concurrency with minimal resource usage by being managed by the JVM."
      - label: "C"
        text_fr: "Virtual threads cannot be used with traditional synchronization mechanisms like 'synchronized'."
        text_en: "Virtual threads cannot be used with traditional synchronization mechanisms like 'synchronized'."
      - label: "D"
        text_fr: "Virtual threads were introduced in Java 17 as part of Project Loom."
        text_en: "Virtual threads were introduced in Java 17 as part of Project Loom."
    correct_answers: ["B"]
    explanation_fr: "Virtual threads are lightweight threads managed by the JVM, enabling high concurrency with minimal resource usage. They are not backed by native OS threads and can use traditional synchronization mechanisms. Virtual threads were introduced in Java 21 as part of Project Loom."
    explanation_en: "Virtual threads are lightweight threads managed by the JVM, enabling high concurrency with minimal resource usage. They are not backed by native OS threads and can use traditional synchronization mechanisms. Virtual threads were introduced in Java 21 as part of Project Loom."
  - id: "jc-uncategorized-003"
    title_fr: "Which statement best describes what code in module.c can do with types from module.x when the modules are declared as below?\n```java\nmodule module.a {\n    exports com.example.a;\n    requires transitive module.x;\n}\n\nmodule module.b {\n    requires module.a;\n    exports com.example.b;\n}\n\nmodule module.c {\n    requires module.b;\n}\n```"
    title_en: "Which statement best describes what code in module.c can do with types from module.x when the modules are declared as below?\n```java\nmodule module.a {\n    exports com.example.a;\n    requires transitive module.x;\n}\n\nmodule module.b {\n    requires module.a;\n    exports com.example.b;\n}\n\nmodule module.c {\n    requires module.b;\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Code in module.c may use types from module.x at runtime, but will always receive a compilation error if they attempt to reference them directly."
        text_en: "Code in module.c may use types from module.x at runtime, but will always receive a compilation error if they attempt to reference them directly."
      - label: "B"
        text_fr: "Code in module.c can use any exported type from module.x, even those not referenced in module.a or module.b."
        text_en: "Code in module.c can use any exported type from module.x, even those not referenced in module.a or module.b."
      - label: "C"
        text_fr: "To access types from module.x, module.c must always explicitly use 'requires module.x', regardless of any transitive requirements."
        text_en: "To access types from module.x, module.c must always explicitly use 'requires module.x', regardless of any transitive requirements."
      - label: "D"
        text_fr: "Code in module.c can use types from module.x if they are part of the public API exported from module.a, but not if they are only used internally in module.a."
        text_en: "Code in module.c can use types from module.x if they are part of the public API exported from module.a, but not if they are only used internally in module.a."
    correct_answers: ["D"]
    explanation_fr: ">"
    explanation_en: ">"
---

Java21DocCards - Uncategorized questions.