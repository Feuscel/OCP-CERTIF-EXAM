---
id: "jc-operators-and-control-flow"
title: "Java21DocCards - Operators and Control Flow"
lang: "en"
duration_minutes: 15
shuffle_questions: true
shuffle_options: true
difficulty: "medium"
tags: ["operators", "control-flow", "loops"]
questions:
  - id: "jc-operators-and-control-flow-001"
    title_fr: "What is the output of this family reunion code?"
    title_en: "What is the output of this family reunion code?"
    type: "single-choice"
    options:
      - label: "A"
        text_fr: "5 11 0 Total: 7"
        text_en: "5 11 0 Total: 7"
      - label: "B"
        text_fr: "4 10 0 Total: 6"
        text_en: "4 10 0 Total: 6"
      - label: "C"
        text_fr: "5 11 5 Total: 12"
        text_en: "5 11 5 Total: 12"
      - label: "D"
        text_fr: "5 10 0 Total: 8"
        text_en: "5 10 0 Total: 8"
      - label: "E"
        text_fr: "4 11 0 Total: 7"
        text_en: "4 11 0 Total: 7"
      - label: "F"
        text_fr: "None of the above"
        text_en: "None of the above"
    correct_answers: ["A"]
    explanation_fr: "For loop runs twice: First iteration: ++parents makes parents=5, children=0+5=5, prints '5'. Second iteration: ++parents makes parents=6, children=5+6=11, prints '11'. While loop: children-- > 8 checks 11>8 (true), then decrements children to 10. Inside loop: uncles=10, children=10-10=0, uncles++ doesn't affect children, prints '0'. Next check: 0>8 is false, loop exits. Final: grandparents=2, parents=6, children=-1 (from the failed while condition). Total: 2+6+(-1)=7."
    explanation_en: "For loop runs twice: First iteration: ++parents makes parents=5, children=0+5=5, prints '5'. Second iteration: ++parents makes parents=6, children=5+6=11, prints '11'. While loop: children-- > 8 checks 11>8 (true), then decrements children to 10. Inside loop: uncles=10, children=10-10=0, uncles++ doesn't affect children, prints '0'. Next check: 0>8 is false, loop exits. Final: grandparents=2, parents=6, children=-1 (from the failed while condition). Total: 2+6+(-1)=7."
---

Java21DocCards - Operators and Control Flow questions.