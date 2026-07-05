---
id: "exam-ocp-01"
title: "Java OCP Exam 01"
lang: "fr"
duration_minutes: 90
shuffle_questions: true
shuffle_options: true
difficulty: "mixed"
tags: ["inheritance", "polymorphism"]
questions:
  - id: "ocp-01-001"
    title_fr: "Héritage et Polymorphisme"
    title_en: "Inheritance and Polymorphism"
    type: "multiple-choice"
    options:
      - label: "A"
        text_fr: "L'interface compile sans erreur."
        text_en: "The interface compiles without error."
      - label: "B"
        text_fr: "Une exception est levée à l'exécution."
        text_en: "An exception is thrown at runtime."
      - label: "C"
        text_fr: "Erreur de compilation à la ligne 4."
        text_en: "Compile error at line 4."
      - label: "D"
        text_fr: "Erreur de compilation à la ligne 5."
        text_en: "Compile error at line 5."
    correct_answers: ["C", "D"]
    explanation_fr: "La redéfinition d'une méthode héritée doit respecter la signature et la visibilité. Une visibilité réduite provoque une erreur de compilation."
    explanation_en: "Overriding an inherited method must respect the signature and visibility. A narrower visibility causes a compile error."
  - id: "ocp-01-002"
    title_fr: "Gestion des exceptions vérifiées"
    title_en: "Checked exception handling"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Le code compile car l'exception est attrapée."
        text_en: "The code compiles because the exception is caught."
      - label: "B"
        text_fr: "Erreur de compilation : exception vérifiée non déclarée."
        text_en: "Compile error: checked exception not declared."
      - label: "C"
        text_fr: "Une exception est levée à l'exécution."
        text_en: "An exception is thrown at runtime."
      - label: "D"
        text_fr: "Le bloc finally ne s'exécute jamais."
        text_en: "The finally block never runs."
    correct_answers: ["B"]
    explanation_fr: "Une exception vérifiée non attrapée ni déclarée dans la signature provoque une erreur de compilation."
    explanation_en: "A checked exception neither caught nor declared in the method signature triggers a compile error."
---

Contenu de l'examen Java OCP Exam 01 (FR).