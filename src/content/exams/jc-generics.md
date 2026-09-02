---
id: "jc-generics"
title: "Java21DocCards - Generics"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["generics", "wildcards", "type-erasure"]
questions:
  - id: "jc-generics-001"
    title_fr: "Which output results from these generic method calls?\n```java\nimport java.util.*;\nclass Family<T> {\n    public static <U> List<U> create(U a, U b) {\n        return List.of(a, b);\n    }\n\n    public static void main(String[] args) {\n        var parents = create(\"Dad\", \"Mom\");\n        var ages = create(45, 42);\n        System.out.println(parents.get(0) + \" \" + ages.get(1));\n    }\n}\n```"
    title_en: "Which output results from these generic method calls?\n```java\nimport java.util.*;\nclass Family<T> {\n    public static <U> List<U> create(U a, U b) {\n        return List.of(a, b);\n    }\n\n    public static void main(String[] args) {\n        var parents = create(\"Dad\", \"Mom\");\n        var ages = create(45, 42);\n        System.out.println(parents.get(0) + \" \" + ages.get(1));\n    }\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Dad Mom"
        text_en: "Dad Mom"
      - label: "B"
        text_fr: "Dad 42"
        text_en: "Dad 42"
      - label: "C"
        text_fr: "Compilation error"
        text_en: "Compilation error"
      - label: "D"
        text_fr: "Mom 45"
        text_en: "Mom 45"
    correct_answers: ["B"]
    explanation_fr: "Generic method infers types separately. Output: Dad 42."
    explanation_en: "Generic method infers types separately. Output: Dad 42."
  - id: "jc-generics-002"
    title_fr: "Given the following family hierarchy and variable declarations, which statements compile without error?\n```java\nimport java.util.*;\nclass Grandparent {}\nclass Parent extends Grandparent {}\nclass Child extends Parent {}\nclass Family {\n    List<? super Grandparent> ancestors = null;\n    List<? extends Child> descendants = null;\n}\n```"
    title_en: "Given the following family hierarchy and variable declarations, which statements compile without error?\n```java\nimport java.util.*;\nclass Grandparent {}\nclass Parent extends Grandparent {}\nclass Child extends Parent {}\nclass Family {\n    List<? super Grandparent> ancestors = null;\n    List<? extends Child> descendants = null;\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "ancestors.add(new Grandparent()); ancestors.add(new Parent()); ancestors.add(new Child());"
        text_en: "ancestors.add(new Grandparent()); ancestors.add(new Parent()); ancestors.add(new Child());"
      - label: "B"
        text_fr: "descendants.add(new Child()); descendants.add(new Parent());"
        text_en: "descendants.add(new Child()); descendants.add(new Parent());"
      - label: "C"
        text_fr: "Grandparent g = ancestors.get(0);"
        text_en: "Grandparent g = ancestors.get(0);"
      - label: "D"
        text_fr: "Parent p = ancestors.get(0);"
        text_en: "Parent p = ancestors.get(0);"
      - label: "E"
        text_fr: "Child c = descendants.get(0);"
        text_en: "Child c = descendants.get(0);"
    correct_answers: ["A"]
    explanation_fr: "For List<? super Grandparent> you can add Grandparent or any subclass. For List<? extends Child> you cannot add anything except null. The return type of get() cannot be assumed without casting, so assignments to specific types other than Object are compilation errors. Option 0 compiles fully; the others do not."
    explanation_en: "For List<? super Grandparent> you can add Grandparent or any subclass. For List<? extends Child> you cannot add anything except null. The return type of get() cannot be assumed without casting, so assignments to specific types other than Object are compilation errors. Option 0 compiles fully; the others do not."
---

Java21DocCards - Generics questions.