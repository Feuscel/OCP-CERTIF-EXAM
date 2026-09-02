---
id: "jc-i-o-nio"
title: "Java21DocCards - I/O & NIO"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["io", "nio", "files", "paths"]
questions:
  - id: "jc-i-o-nio-001"
    title_fr: "A family photo management application needs to organize photos by family member directories. Which combination of Path operations will correctly resolve a relative path against an absolute base path?"
    title_en: "A family photo management application needs to organize photos by family member directories. Which combination of Path operations will correctly resolve a relative path against an absolute base path?"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Path.of('/home/family').resolve('../photos/dad.jpg') results in '/home/photos/dad.jpg'"
        text_en: "Path.of('/home/family').resolve('../photos/dad.jpg') results in '/home/photos/dad.jpg'"
      - label: "B"
        text_fr: "Path.of('/home/family').resolve('/photos/dad.jpg') results in '/home/family/photos/dad.jpg'"
        text_en: "Path.of('/home/family').resolve('/photos/dad.jpg') results in '/home/family/photos/dad.jpg'"
      - label: "C"
        text_fr: "Path.of('/home/family').normalize().resolve('mom/../dad.jpg') results in '/home/family/dad.jpg'"
        text_en: "Path.of('/home/family').normalize().resolve('mom/../dad.jpg') results in '/home/family/dad.jpg'"
      - label: "D"
        text_fr: "Path.of('/home/family').resolveSibling('photos').resolve('dad.jpg') results in '/home/photos/dad.jpg'"
        text_en: "Path.of('/home/family').resolveSibling('photos').resolve('dad.jpg') results in '/home/photos/dad.jpg'"
      - label: "E"
        text_fr: "All of the above are correct"
        text_en: "All of the above are correct"
    correct_answers: ["D"]
    explanation_fr: "Option A: resolve('../photos/dad.jpg') appends the relative path, giving '/home/family/../photos/dad.jpg' which when normalized becomes '/home/photos/dad.jpg'. Option B: resolve() with absolute path returns the absolute path unchanged, so result is '/photos/dad.jpg', not the combined path. Option C: resolve() happens before normalize() has any effect on the argument. Option D: resolveSibling('photos') replaces 'family' with 'photos' giving '/home/photos', then resolve('dad.jpg') gives '/home/photos/dad.jpg'."
    explanation_en: "Option A: resolve('../photos/dad.jpg') appends the relative path, giving '/home/family/../photos/dad.jpg' which when normalized becomes '/home/photos/dad.jpg'. Option B: resolve() with absolute path returns the absolute path unchanged, so result is '/photos/dad.jpg', not the combined path. Option C: resolve() happens before normalize() has any effect on the argument. Option D: resolveSibling('photos') replaces 'family' with 'photos' giving '/home/photos', then resolve('dad.jpg') gives '/home/photos/dad.jpg'."
---

Java21DocCards - I/O & NIO questions.