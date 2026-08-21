"use client";

import {
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AI_INFRASTRUCTURE_OPTIONS,
  BUDGET_RANGES,
  PATHWAYS,
  REGIONAL_RESOURCE_OPTIONS,
  TIMELINES,
  isProjectInquiryConfigured,
  submitProjectInquiry,
  type PathwayId,
  type ProjectInquiryPayload,
} from "@/lib/projectInquiry";

type FormState = {
  name: string;
  company: string;
  email: string;
  budgetRange: string;
  pathway: PathwayId | "";
  pathwayOptions: string[];
  partnershipDetail: string;
  projectBrief: string;
  timeline: string;
  additionalRequirements: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL: FormState = {
  name: "",
  company: "",
  email: "",
  budgetRange: "",
  pathway: "",
  pathwayOptions: [],
  partnershipDetail: "",
  projectBrief: "",
  timeline: "",
  additionalRequirements: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.company.trim()) errors.company = "Please enter your company.";

  if (!values.email.trim()) {
    errors.email = "Please enter your work email.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid work email address.";
  }

  if (!values.pathway) errors.pathway = "Select a project type.";

  if (!values.projectBrief.trim()) {
    errors.projectBrief = "Please share a short project summary.";
  } else if (values.projectBrief.trim().length < 12) {
    errors.projectBrief = "Add a little more detail to your summary.";
  }

  return errors;
}

function Field({
  id,
  label,
  required,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="inquiry-field">
      <label htmlFor={id} className="inquiry-label">
        {label}
        {required ? (
          <span className="inquiry-required" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="inquiry-optional"> (optional)</span>
        )}
      </label>
      {hint ? <p className="inquiry-hint">{hint}</p> : null}
      {children}
      {error ? (
        <p id={errorId} className="inquiry-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ProjectInquiryForm() {
  const formId = useId();
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const selectPathway = (pathway: PathwayId) => {
    setValues((prev) => ({
      ...prev,
      pathway,
      pathwayOptions: [],
      partnershipDetail: "",
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.pathway;
      return next;
    });
  };

  const toggleOption = (option: string) => {
    setValues((prev) => {
      const exists = prev.pathwayOptions.includes(option);
      return {
        ...prev,
        pathwayOptions: exists
          ? prev.pathwayOptions.filter((item) => item !== option)
          : [...prev.pathwayOptions, option],
      };
    });
  };

  const resetForm = () => {
    setValues(INITIAL);
    setErrors({});
    setSubmitError(null);
    setSubmitted(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!isProjectInquiryConfigured) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (!values.pathway) return;

    const payload: ProjectInquiryPayload = {
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      budgetRange: values.budgetRange,
      pathway: values.pathway,
      pathwayOptions: values.pathwayOptions,
      partnershipDetail: values.partnershipDetail.trim(),
      projectBrief: values.projectBrief.trim(),
      timeline: values.timeline,
      additionalRequirements: values.additionalRequirements.trim(),
      submittedAt: new Date().toISOString(),
    };

    setPending(true);
    try {
      await submitProjectInquiry(payload);
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Something went wrong while sending your enquiry. Please try again.",
      );
    } finally {
      setPending(false);
    }
  };

  if (submitted) {
    return (
      <div className="inquiry-success" role="status" aria-live="polite">
        <p className="inquiry-success__eyebrow">Enquiry received</p>
        <h3 className="font-display inquiry-success__title">Thank you.</h3>
        <p className="inquiry-success__copy">
          We&apos;ll review your requirements and respond with the clearest next
          step.
        </p>
        <button
          type="button"
          className="inquiry-success__reset"
          onClick={resetForm}
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  const secondaryOptions =
    values.pathway === "ai-infrastructure"
      ? AI_INFRASTRUCTURE_OPTIONS
      : values.pathway === "regional-resource"
        ? REGIONAL_RESOURCE_OPTIONS
        : null;

  return (
    <form
      className="inquiry-form"
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={`${formId}-title`}
    >
      <div className="inquiry-form__intro">
        <p id={`${formId}-title`} className="inquiry-form__title">
          Project enquiry
        </p>
        <p className="inquiry-form__note">
          Fields marked <span aria-hidden="true">*</span>
          <span className="sr-only">required</span> are required.
        </p>
      </div>

      <div className="inquiry-grid">
        <Field id={`${formId}-name`} label="Name" required error={errors.name}>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className={`inquiry-input ${errors.name ? "is-invalid" : ""}`}
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          />
        </Field>

        <Field
          id={`${formId}-company`}
          label="Company"
          required
          error={errors.company}
        >
          <input
            id={`${formId}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            className={`inquiry-input ${errors.company ? "is-invalid" : ""}`}
            value={values.company}
            onChange={(event) => setField("company", event.target.value)}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={
              errors.company ? `${formId}-company-error` : undefined
            }
          />
        </Field>
      </div>

      <Field
        id={`${formId}-email`}
        label="Work Email"
        required
        error={errors.email}
      >
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          className={`inquiry-input ${errors.email ? "is-invalid" : ""}`}
          value={values.email}
          onChange={(event) => setField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
        />
      </Field>

      <fieldset className="inquiry-fieldset">
        <legend className="inquiry-label">
          Project Type
          <span className="inquiry-required" aria-hidden="true">
            {" "}
            *
          </span>
        </legend>
        <p className="inquiry-hint">Choose the primary pathway that fits best.</p>
        <div
          className="inquiry-pathways"
          role="radiogroup"
          aria-required="true"
          aria-invalid={Boolean(errors.pathway)}
        >
          {PATHWAYS.map((pathway) => {
            const selected = values.pathway === pathway.id;
            return (
              <button
                key={pathway.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`inquiry-pathway ${selected ? "is-selected" : ""}`}
                onClick={() => selectPathway(pathway.id)}
              >
                <span className="inquiry-pathway__mark" aria-hidden="true" />
                <span className="inquiry-pathway__body">
                  <span className="inquiry-pathway__title">{pathway.title}</span>
                  <span className="inquiry-pathway__copy">
                    {pathway.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {errors.pathway ? (
          <p className="inquiry-error" role="alert">
            {errors.pathway}
          </p>
        ) : null}
      </fieldset>

      {secondaryOptions ? (
        <fieldset className="inquiry-fieldset inquiry-fieldset--secondary">
          <legend className="inquiry-label">
            Engagement model
            <span className="inquiry-optional"> (optional)</span>
          </legend>
          <div className="inquiry-chips">
            {secondaryOptions.map((option) => {
              const checked = values.pathwayOptions.includes(option);
              return (
                <label
                  key={option}
                  className={`inquiry-chip ${checked ? "is-selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleOption(option)}
                  />
                  <span aria-hidden="true" className="inquiry-chip__box" />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {values.pathway === "partnership-other" ? (
        <Field
          id={`${formId}-partnership`}
          label="Engagement model"
          error={errors.partnershipDetail}
        >
          <textarea
            id={`${formId}-partnership`}
            name="partnershipDetail"
            rows={3}
            className="inquiry-input inquiry-textarea"
            value={values.partnershipDetail}
            onChange={(event) =>
              setField("partnershipDetail", event.target.value)
            }
            placeholder="Describe the partnership, supply relationship or other enquiry."
          />
        </Field>
      ) : null}

      <Field
        id={`${formId}-brief`}
        label="Short Project Summary"
        required
        error={errors.projectBrief}
      >
        <textarea
          id={`${formId}-brief`}
          name="projectBrief"
          rows={4}
          className={`inquiry-input inquiry-textarea ${errors.projectBrief ? "is-invalid" : ""}`}
          value={values.projectBrief}
          onChange={(event) => setField("projectBrief", event.target.value)}
          aria-invalid={Boolean(errors.projectBrief)}
          placeholder="Tell us what you are planning, where the project is located, and what support you need."
        />
      </Field>

      <div className="inquiry-grid">
        <Field id={`${formId}-budget`} label="Budget Range">
          <select
            id={`${formId}-budget`}
            name="budgetRange"
            className="inquiry-input inquiry-select"
            value={values.budgetRange}
            onChange={(event) => setField("budgetRange", event.target.value)}
          >
            <option value="">Select budget range</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </Field>

        <Field id={`${formId}-timeline`} label="Expected Timeline">
          <select
            id={`${formId}-timeline`}
            name="timeline"
            className="inquiry-input inquiry-select"
            value={values.timeline}
            onChange={(event) => setField("timeline", event.target.value)}
          >
            <option value="">Select timeline</option>
            {TIMELINES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id={`${formId}-additional`}
        label="Additional Requirements"
      >
        <textarea
          id={`${formId}-additional`}
          name="additionalRequirements"
          rows={3}
          className="inquiry-input inquiry-textarea"
          value={values.additionalRequirements}
          onChange={(event) =>
            setField("additionalRequirements", event.target.value)
          }
          placeholder="Constraints, stakeholders, locations or other context."
        />
      </Field>

      {submitError ? (
        <p className="inquiry-error" role="alert">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        className="inquiry-submit"
        disabled={!isProjectInquiryConfigured || pending}
      >
        {pending ? "Sending…" : "Submit Project Enquiry"}
      </button>
      {isProjectInquiryConfigured ? (
        <p className="inquiry-submit-note">
          We will review your requirements and respond with the appropriate next
          step.
        </p>
      ) : (
        <p className="inquiry-submit-note" role="status">
          Form integration pending
        </p>
      )}
    </form>
  );
}
