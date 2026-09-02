---
id: "jc-modules"
title: "Java21DocCards - Modules"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["modules", "jpms", "module-system"]
questions:
  - id: "jc-modules-001"
    title_fr: "In a bottom-up migration to the Java module system, what is the recommended first step?"
    title_en: "In a bottom-up migration to the Java module system, what is the recommended first step?"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Move all existing JARs to the module path"
        text_en: "Move all existing JARs to the module path"
      - label: "B"
        text_fr: "Convert all JARs to automatic modules at once"
        text_en: "Convert all JARs to automatic modules at once"
      - label: "C"
        text_fr: "Start by converting the module with the most dependencies"
        text_en: "Start by converting the module with the most dependencies"
      - label: "D"
        text_fr: "Add a module-info.class to every JAR before running the application"
        text_en: "Add a module-info.class to every JAR before running the application"
      - label: "E"
        text_fr: "Start by converting the module with the fewest dependencies into a named module"
        text_en: "Start by converting the module with the fewest dependencies into a named module"
    correct_answers: ["E"]
    explanation_fr: "In bottom-up migration, you begin by converting the module with the fewest dependencies into a named module. Other JARs stay on the classpath initially. This avoids breaking the build and allows gradual migration."
    explanation_en: "In bottom-up migration, you begin by converting the module with the fewest dependencies into a named module. Other JARs stay on the classpath initially. This avoids breaking the build and allows gradual migration."
---

Java21DocCards - Modules questions.