---
id: "jc-localization"
title: "Java21DocCards - Localization"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["localization", "resourcebundle", "locale"]
questions:
  - id: "jc-localization-001"
    title_fr: "A family genealogy application supports multiple languages and regions. Given the following ResourceBundle files in the classpath, which file will be selected when loading the bundle with Locale('fr', 'CA')?"
    title_en: "A family genealogy application supports multiple languages and regions. Given the following ResourceBundle files in the classpath, which file will be selected when loading the bundle with Locale('fr', 'CA')?"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "FamilyMessages_CA.properties"
        text_en: "FamilyMessages_CA.properties"
      - label: "B"
        text_fr: "FamilyMessages.properties"
        text_en: "FamilyMessages.properties"
      - label: "C"
        text_fr: "FamilyMessages_en.properties"
        text_en: "FamilyMessages_en.properties"
      - label: "D"
        text_fr: "FamilyMessages_fr_FR.properties"
        text_en: "FamilyMessages_fr_FR.properties"
      - label: "E"
        text_fr: "FamilyMessages_fr.properties"
        text_en: "FamilyMessages_fr.properties"
    correct_answers: ["E"]
    explanation_fr: "ResourceBundle follows a specific search hierarchy: most specific to least specific. For Locale('fr', 'CA'), it searches for: 1) FamilyMessages_fr_CA.properties (not found), 2) FamilyMessages_fr.properties (found and selected), 3) FamilyMessages.properties (not needed). The search stops at the first match found. FamilyMessages_fr.properties is selected because it matches the language code 'fr' even though the country code 'CA' doesn't have a specific file."
    explanation_en: "ResourceBundle follows a specific search hierarchy: most specific to least specific. For Locale('fr', 'CA'), it searches for: 1) FamilyMessages_fr_CA.properties (not found), 2) FamilyMessages_fr.properties (found and selected), 3) FamilyMessages.properties (not needed). The search stops at the first match found. FamilyMessages_fr.properties is selected because it matches the language code 'fr' even though the country code 'CA' doesn't have a specific file."
---

Java21DocCards - Localization questions.