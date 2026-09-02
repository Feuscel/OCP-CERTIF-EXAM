---
id: "jc-exceptions"
title: "Java21DocCards - Exceptions"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["exceptions", "try-with-resources", "error-handling"]
questions:
  - id: "jc-exceptions-001"
    title_fr: "What happens when this override declaration is executed?\n```java\nclass Parent {\n  void cook() throws Exception { throw new Exception(\"Parent\"); }\n}\nclass Child extends Parent {\n  @Override void cook() throws java.io.IOException { throw new java.io.IOException(\"Child\"); }\n  public static void main(String[] args) throws Exception {\n    new Child().cook();\n  }\n}\n```"
    title_en: "What happens when this override declaration is executed?\n```java\nclass Parent {\n  void cook() throws Exception { throw new Exception(\"Parent\"); }\n}\nclass Child extends Parent {\n  @Override void cook() throws java.io.IOException { throw new java.io.IOException(\"Child\"); }\n  public static void main(String[] args) throws Exception {\n    new Child().cook();\n  }\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Compilation error: must catch IOException"
        text_en: "Compilation error: must catch IOException"
      - label: "B"
        text_fr: "Compiles and throws IOException with message 'Child'"
        text_en: "Compiles and throws IOException with message 'Child'"
      - label: "C"
        text_fr: "Prints Parent"
        text_en: "Prints Parent"
      - label: "D"
        text_fr: "Compilation error: IOException not allowed"
        text_en: "Compilation error: IOException not allowed"
    correct_answers: ["B"]
    explanation_fr: "Child's cook() is a valid override that narrows the exception type from Exception to IOException (its subclass). When executed, it throws an IOException with message 'Child'. The main method declares 'throws Exception' which covers IOException."
    explanation_en: "Child's cook() is a valid override that narrows the exception type from Exception to IOException (its subclass). When executed, it throws an IOException with message 'Child'. The main method declares 'throws Exception' which covers IOException."
  - id: "jc-exceptions-002"
    title_fr: "Consider a try-with-resources block that uses an AutoCloseable resource and also has a finally block. Which output is correct?\n```java\nclass Resource implements AutoCloseable {\n    public void use() { System.out.print(\"Using\"); }\n    public void close() { System.out.print(\"Closed\"); }\n}\nclass Family {\n    public static void main(String[] args) {\n        Resource r = new Resource();\n        try (r) {\n            r.use();\n        } finally {\n            System.out.print(\"Finally\");\n        }\n    }\n}\n```"
    title_en: "Consider a try-with-resources block that uses an AutoCloseable resource and also has a finally block. Which output is correct?\n```java\nclass Resource implements AutoCloseable {\n    public void use() { System.out.print(\"Using\"); }\n    public void close() { System.out.print(\"Closed\"); }\n}\nclass Family {\n    public static void main(String[] args) {\n        Resource r = new Resource();\n        try (r) {\n            r.use();\n        } finally {\n            System.out.print(\"Finally\");\n        }\n    }\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "UsingFinallyClosed"
        text_en: "UsingFinallyClosed"
      - label: "B"
        text_fr: "FinallyUsingClosed"
        text_en: "FinallyUsingClosed"
      - label: "C"
        text_fr: "UsingClosedFinally"
        text_en: "UsingClosedFinally"
      - label: "D"
        text_fr: "UsingClosed"
        text_en: "UsingClosed"
      - label: "E"
        text_fr: "FinallyClosedUsing"
        text_en: "FinallyClosedUsing"
      - label: "F"
        text_fr: "None of the above"
        text_en: "None of the above"
    correct_answers: ["C"]
    explanation_fr: "Even when the resource is declared outside the try (Java 9+ feature), try-with-resources still calls close() after the try block completes. Then the finally block executes. So the output order is 'Using' (try body) → 'Closed' (resource auto-close) → 'Finally' (finally block)."
    explanation_en: "Even when the resource is declared outside the try (Java 9+ feature), try-with-resources still calls close() after the try block completes. Then the finally block executes. So the output order is 'Using' (try body) → 'Closed' (resource auto-close) → 'Finally' (finally block)."
---

Java21DocCards - Exceptions questions.