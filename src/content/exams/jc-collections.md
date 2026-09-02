---
id: "jc-collections"
title: "Java21DocCards - Collections"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["collections", "maps", "sets", "lists"]
questions:
  - id: "jc-collections-001"
    title_fr: "Which key does firstKey() return for a TreeMap with these entries?\n```java\nimport java.util.*;\nclass Family {\n    public static void main(String[] args) {\n        var map = new TreeMap<String,Integer>();\n        map.put(\"Mom\", 1);\n        map.put(\"Dad\", 2);\n        map.put(\"Son\", 3);\n        System.out.println(map.firstKey());\n    }\n}\n```"
    title_en: "Which key does firstKey() return for a TreeMap with these entries?\n```java\nimport java.util.*;\nclass Family {\n    public static void main(String[] args) {\n        var map = new TreeMap<String,Integer>();\n        map.put(\"Mom\", 1);\n        map.put(\"Dad\", 2);\n        map.put(\"Son\", 3);\n        System.out.println(map.firstKey());\n    }\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "Son"
        text_en: "Son"
      - label: "B"
        text_fr: "Dad"
        text_en: "Dad"
      - label: "C"
        text_fr: "null"
        text_en: "null"
      - label: "D"
        text_fr: "Mom"
        text_en: "Mom"
      - label: "E"
        text_fr: "None of the above"
        text_en: "None of the above"
    correct_answers: ["B"]
    explanation_fr: "TreeMap orders keys naturally. firstKey() returns the smallest key: Dad."
    explanation_en: "TreeMap orders keys naturally. firstKey() returns the smallest key: Dad."
  - id: "jc-collections-002"
    title_fr: "Which expression correctly handles a TreeMap key search?\n```java\nimport java.util.*;\nclass Family {\n    public static void main(String[] args) {\n        var map = new TreeMap<String,Integer>();\n        map.put(\"Dad\", 1);\n        map.put(\"Mom\", 2);\n        map.put(\"Son\", 3);\n        /* ??? */\n    }\n}\n```"
    title_en: "Which expression correctly handles a TreeMap key search?\n```java\nimport java.util.*;\nclass Family {\n    public static void main(String[] args) {\n        var map = new TreeMap<String,Integer>();\n        map.put(\"Dad\", 1);\n        map.put(\"Mom\", 2);\n        map.put(\"Son\", 3);\n        /* ??? */\n    }\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "map.firstKey()"
        text_en: "map.firstKey()"
      - label: "B"
        text_fr: "map.getKey(0)"
        text_en: "map.getKey(0)"
      - label: "C"
        text_fr: "map.firstEntryKey()"
        text_en: "map.firstEntryKey()"
      - label: "D"
        text_fr: "map.head()"
        text_en: "map.head()"
    correct_answers: ["A"]
    explanation_fr: "TreeMap.firstKey() returns the least key according to natural order."
    explanation_en: "TreeMap.firstKey() returns the least key according to natural order."
---

Java21DocCards - Collections questions.