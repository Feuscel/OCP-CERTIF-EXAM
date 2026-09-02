---
id: "jc-date-time"
title: "Java21DocCards - Date/Time"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["datetime", "localdate", "zoneddatetime"]
questions:
  - id: "jc-date-time-001"
    title_fr: "Europe/Paris moves clocks forward 1 hour for spring DST on 30 March 2025 (The clock jumps from 02:00 AM to 03:00 AM). What is the Duration in hours when adding 3 hours to 01:30 across this transition?\n```java\nimport java.time.*;\nclass Family {\n    public static void main(String[] args) {\n        ZonedDateTime z1 = ZonedDateTime.of(2025, 3, 30, 1, 30, 0, 0, ZoneId.of(\"Europe/Paris\"));\n        ZonedDateTime z2 = z1.plusHours(3);\n        Duration d = Duration.between(z1, z2);\n        System.out.println(d.toHours());\n    }\n}\n```"
    title_en: "Europe/Paris moves clocks forward 1 hour for spring DST on 30 March 2025 (The clock jumps from 02:00 AM to 03:00 AM). What is the Duration in hours when adding 3 hours to 01:30 across this transition?\n```java\nimport java.time.*;\nclass Family {\n    public static void main(String[] args) {\n        ZonedDateTime z1 = ZonedDateTime.of(2025, 3, 30, 1, 30, 0, 0, ZoneId.of(\"Europe/Paris\"));\n        ZonedDateTime z2 = z1.plusHours(3);\n        Duration d = Duration.between(z1, z2);\n        System.out.println(d.toHours());\n    }\n}\n```"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "2"
        text_en: "2"
      - label: "B"
        text_fr: "3"
        text_en: "3"
      - label: "C"
        text_fr: "-2"
        text_en: "-2"
      - label: "D"
        text_fr: "-3"
        text_en: "-3"
      - label: "E"
        text_fr: "Throws exception"
        text_en: "Throws exception"
    correct_answers: ["A"]
    explanation_fr: "On 30 March 2025, Europe/Paris starts Daylight Saving Time at 02:00 AM. The clock jumps forward to 03:00 AM, effectively skipping one hour. Starting at 01:30, adding 3 hours would normally reach 04:30 on the clock, but because 02:00–03:00 does not exist, only 2 actual hours pass. Duration.between measures actual elapsed time, so it returns 2 hours."
    explanation_en: "On 30 March 2025, Europe/Paris starts Daylight Saving Time at 02:00 AM. The clock jumps forward to 03:00 AM, effectively skipping one hour. Starting at 01:30, adding 3 hours would normally reach 04:30 on the clock, but because 02:00–03:00 does not exist, only 2 actual hours pass. Duration.between measures actual elapsed time, so it returns 2 hours."
---

Java21DocCards - Date/Time questions.