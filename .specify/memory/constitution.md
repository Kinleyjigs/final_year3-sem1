<!--
Sync Impact Report
==================
Version Change: N/A → 1.0.0
Ratification: Initial constitution adoption for One Stop Book project
Principles Added:
  - Code Quality (6 rules)
  - Testing (4 rules)
  - Reliability & Performance (5 rules)
  - Security (5 rules)
  - User Experience (4 rules)
  - Documentation & Process (4 rules)
  - Continuous Improvement (3 rules)
Templates Requiring Updates:
  ✅ .specify/templates/plan-template.md (Constitution Check section updated)
  ✅ .specify/templates/spec-template.md (aligned with requirements)
  ✅ .specify/templates/tasks-template.md (aligned with task organization)
Follow-up TODOs: None
-->

# Project Constitution: One Stop Book

**Version**: 1.0.0
**Ratified**: 2025-11-24
**Last Amended**: 2025-11-24

## Purpose

This constitution defines the non-negotiable principles and governance rules for the One Stop Book project. All features, code changes, and technical decisions MUST comply with these principles. Deviations require explicit justification and team approval.

---

## Principles

### Principle 1: Code Quality

**Name**: Maintainable, Modular, and Reusable Code

**Rules**:
- MUST adopt consistent coding style and naming conventions across all services and components.
- Services MUST be small, single-purpose, and replaceable (microservice design philosophy).
- Controllers MUST NOT contain business logic; business logic belongs in services.
- API boundaries MUST use Data Transfer Objects (DTOs) to enforce clear contracts.
- Services MUST NOT be tightly coupled; dependencies MUST be injected and interfaces preferred over concrete implementations.
- Code duplication MUST be avoided; design for reuse through shared libraries and utilities.

**Rationale**: Consistent, modular code reduces cognitive load, accelerates debugging, simplifies testing, and enables independent service evolution. DTOs enforce clear API contracts and prevent internal model leakage. Single-purpose services ensure replaceability and scalability.

---

### Principle 2: Testing

**Name**: Comprehensive, Automated, and Isolated Testing

**Rules**:
- Unit tests MUST be written for all booking, maintenance, and availability logic.
- Integration tests MUST cover multi-service flows and end-to-end scenarios.
- External services and databases MUST be mocked in unit and integration tests to ensure isolation.
- Continuous Integration (CI) MUST automatically run all tests before any code merge to the main branch.

**Rationale**: Automated testing catches regressions early, reduces manual QA effort, and ensures confidence in refactoring. Isolated tests run faster and are deterministic. CI enforcement prevents broken code from reaching production.

---

### Principle 3: Reliability & Performance

**Name**: Resilient, Observable, and Responsive Services

**Rules**:
- The API Gateway MUST remain responsive under load and enforce request timeout rules.
- Each microservice MUST expose health endpoints for monitoring and orchestration.
- The user-facing API MUST maintain a minimum 99% availability target.
- Internal RPC failures MUST fail fast with graceful degradation (e.g., fallback responses, circuit breakers).
- Performance budgets MUST be defined and monitored (e.g., p95 latency < 200ms).

**Rationale**: High availability and responsiveness are critical for user trust and operational efficiency. Health endpoints enable automated recovery. Fail-fast strategies prevent cascading failures. Performance budgets enforce accountability for scalability.

---

### Principle 4: Security

**Name**: Zero Trust, Least Privilege, and Defense in Depth

**Rules**:
- Role-Based Access Control (RBAC) MUST be enforced: user vs college admin roles with distinct permissions.
- Token-based authentication (JWT) MUST be enforced at the API Gateway boundary.
- Internal RPC calls MUST propagate user identity for downstream authorization decisions.
- Sensitive data (passwords, tokens, PII) MUST NOT appear in logs, error messages, or debug output.
- All request inputs MUST undergo mandatory validation (type, format, range, sanitization).

**Rationale**: Security is non-negotiable in a multi-user booking system. RBAC prevents privilege escalation. JWT tokens enable stateless authentication. Identity propagation ensures end-to-end auditability. Input validation prevents injection attacks. Log sanitization prevents credential leakage.

---

### Principle 5: User Experience

**Name**: Simple, Fast, and Transparent Interactions

**Rules**:
- Users MUST be able to complete a booking in fewer than 4 clicks.
- The UI MUST be simple, mobile-friendly, and accessible.
- All booking and maintenance states MUST be clearly communicated: pending, approved, rejected, canceled, maintenance.
- Error states MUST be clear and actionable (no confusing messages or technical jargon exposed to users).

**Rationale**: User satisfaction drives adoption. Minimizing clicks reduces friction. Mobile-first design accommodates the majority of modern users. Clear state communication builds trust and reduces support requests. Actionable errors empower users to self-resolve issues.

---

### Principle 6: Documentation & Process

**Name**: Written Contracts, Traceable Decisions, and Defined Completion

**Rules**:
- All APIs MUST have written contracts (OpenAPI/Swagger or equivalent).
- Architectural Decision Records (ADRs) MUST be created for major technical choices (e.g., database selection, service boundaries, authentication strategy).
- Definition of Done (DoD) MUST include documentation, tests, and a working demo.
- Changes MUST be tracked through a change-log (e.g., CHANGELOG.md or equivalent).

**Rationale**: Written contracts prevent integration breakage. ADRs preserve context for future maintainers. A rigorous DoD ensures quality gates are met. Change-logs provide transparency and traceability for stakeholders.

---

### Principle 7: Continuous Improvement

**Name**: Regular Reflection and Iterative Enhancement

**Rules**:
- Sprint retrospectives MUST occur every 7 days.
- Lessons learned MUST be documented and shared with the team.
- Improvement actions MUST be added to the backlog and prioritized.

**Rationale**: Regular retrospectives create a culture of learning and adaptation. Documented lessons prevent repeated mistakes. Backlog prioritization ensures improvements are acted upon, not just discussed.

---

## Governance

### Amendment Procedure

1. Proposed changes MUST be submitted as a pull request to this file.
2. Changes MUST include a rationale and impact analysis.
3. Approval requires consensus from at least two team leads or project stakeholders.
4. Version numbering follows semantic versioning:
   - **MAJOR**: Backward-incompatible principle removals or redefinitions.
   - **MINOR**: New principles or material expansions to existing guidance.
   - **PATCH**: Clarifications, wording improvements, or non-semantic refinements.

### Versioning Policy

- Each amendment MUST update the version number and `Last Amended` date.
- A Sync Impact Report MUST be prepended as an HTML comment documenting changes.

### Compliance Review

- Constitution compliance MUST be checked during:
  - Feature planning (plan.md creation).
  - Code reviews (PR checklist).
  - Sprint retrospectives (process adherence).
- Violations MUST be justified in the Complexity Tracking table of plan.md.

---

## Appendix

### Definitions

- **DTO (Data Transfer Object)**: A simple object that carries data between layers or services without business logic.
- **RBAC (Role-Based Access Control)**: Access control mechanism based on user roles and permissions.
- **ADR (Architectural Decision Record)**: A document capturing a significant architectural decision, its context, and consequences.
- **DoD (Definition of Done)**: Criteria that MUST be met for a task to be considered complete.
- **Fail Fast**: Design principle where errors are detected and reported immediately rather than propagating.

### References

- README.md: Project overview and getting started guide
- .specify/templates/plan-template.md: Feature planning workflow
- .specify/templates/spec-template.md: Feature specification structure
- .specify/templates/tasks-template.md: Task breakdown and execution order
