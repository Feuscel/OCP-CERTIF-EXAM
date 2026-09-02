---
id: "jc-wrapper-classes"
title: "Java21DocCards - Wrapper Classes"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["wrapper-classes", "boxing", "integer"]
questions:
  - id: "jc-wrapper-classes-001"
    title_fr: "What is the output of this family age comparison system?"
    title_en: "What is the output of this family age comparison system?"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "false false true true "
        text_en: "false false true true "
      - label: "B"
        text_fr: "true true true true "
        text_en: "true true true true "
      - label: "C"
        text_fr: "true false true true "
        text_en: "true false true true "
      - label: "D"
        text_fr: "false true false true "
        text_en: "false true false true "
      - label: "E"
        text_fr: "true false false true "
        text_en: "true false false true "
    correct_answers: ["C"]
    explanation_fr: "Integer caching applies to values -128 to 127. dadAge and momAge both reference the same cached Integer object for 127, so == returns true. sonAge and daughterAge are different objects for 128 (outside cache range), so == returns false. However, equals() compares values, not references, so both equals() calls return true regardless of caching."
    explanation_en: "Integer caching applies to values -128 to 127. dadAge and momAge both reference the same cached Integer object for 127, so == returns true. sonAge and daughterAge are different objects for 128 (outside cache range), so == returns false. However, equals() compares values, not references, so both equals() calls return true regardless of caching."
---

Java21DocCards - Wrapper Classes questions.