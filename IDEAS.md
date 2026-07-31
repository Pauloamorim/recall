# Parked ideas

Out of scope for the current milestone. Revisit when the phase that owns them arrives.

- **ChatGPT custom instructions are high-signal memory.** Export nodes with
  `content_type: "user_editable_context"` carry `user_profile` / `user_instructions` —
  the user's own stated preferences, verbatim. Probably the densest memory source in a
  whole export, but it needs a place in the normalized model (not a user/assistant turn).
  Decide during Phase 1 distillation, not in the parser.
- **Attachments and images** are dropped by the parser (asset pointers only, no content).
  Fine for text distillation; revisit only if memories start referencing missing context.
