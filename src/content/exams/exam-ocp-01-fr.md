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
    title: "Héritage et Polymorphisme"
    type: "multiple-choice"
    options:
      - A: "L'interface compile sans erreur."
      - B: "Une exception est levée à l'exécution."
      - C: "Erreur de compilation à la ligne 4."
      - D: "Erreur de compilation à la ligne 5."
    correct_answers: ["C", "D"]
    explanation_fr: "La redéfinition d'une méthode héritée doit respecter la signature et la visibilité. Une visibilité réduite provoque une erreur de compilation."
    explanation_en: "Overriding an inherited method must respect the signature and visibility. A narrower visibility causes a compile error."
  - id: "ocp-01-002"
    title: "Gestion des exceptions vérifiées"
    type: "single-choice"
    options:
      - A: "Le code compile car l'exception est attrapée."
      - B: "Erreur de compilation : exception vérifiée non déclarée."
      - C: "Une exception est levée à l'exécution."
      - D: "Le bloc finally ne s'exécute jamais."
    correct_answers: ["B"]
    explanation_fr: "Une exception vérifiée non attrapée ni déclarée dans la signature provoque une erreur de compilation."
    explanation_en: "A checked exception neither caught nor declared in the method signature triggers a compile error."
---

Contenu de l'examen Java OCP Exam 01 (FR).