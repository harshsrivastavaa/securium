"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";

const courseSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Course name must be at least 2 characters.")
    .max(120, "Course name cannot be more than 120 characters.")
    .required("Course name is required."),
  description: Yup.string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description cannot be more than 1000 characters.")
    .required("Description is required."),
  price: Yup.number()
    .typeError("Price must be a number.")
    .positive("Price must be greater than zero.")
    .max(999999, "Price is too high.")
    .required("Price is required."),
  duration: Yup.string()
    .trim()
    .min(1, "Duration is required.")
    .max(80, "Duration cannot be more than 80 characters.")
    .required("Duration is required."),
});

const emptyCourse = {
  name: "",
  description: "",
  price: "",
  duration: "",
};

function FieldError({ children }) {
  if (!children) return null;

  return <p className="mt-1 text-sm text-red-600">{children}</p>;
}

function getInitialValues(course) {
  if (!course) {
    return emptyCourse;
  }

  return {
    name: course.name || "",
    description: course.description || "",
    price: course.price || "",
    duration: course.duration || "",
  };
}

export default function CourseForm({ editingCourse, onCancelEdit, onSubmitCourse }) {
  const isEditing = Boolean(editingCourse);

  return (
    <Formik
      enableReinitialize
      initialValues={getInitialValues(editingCourse)}
      validationSchema={courseSchema}
      onSubmit={async (values, { resetForm, setSubmitting, setStatus }) => {
        setStatus(null);

        try {
          await onSubmitCourse({
            ...values,
            price: Number(values.price),
          });
          resetForm();
        } catch (error) {
          setStatus(error.message || "Unable to save this course right now.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status }) => (
        <Form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                {isEditing ? "Edit Course" : "Add Course"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {isEditing
                  ? "Update the selected course details."
                  : "Add a new course to the directory."}
              </p>
            </div>

            {isEditing ? (
              <button
                type="button"
                onClick={onCancelEdit}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Course name</span>
              <input
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                placeholder="React Essentials"
              />
              <FieldError>{touched.name && errors.name}</FieldError>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                className="mt-1 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                placeholder="What will students learn?"
              />
              <FieldError>{touched.description && errors.description}</FieldError>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Price</span>
                <input
                  name="price"
                  type="number"
                  min="1"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="4999"
                />
                <FieldError>{touched.price && errors.price}</FieldError>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Duration </span>
                <input
                  name="duration"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  placeholder="6"
                />
                <FieldError>{touched.duration && errors.duration}</FieldError>
              </label>
            </div>
          </div>

          {status ? <p className="mt-4 text-sm text-red-600">{status}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
                ? "Save Changes"
                : "Add Course"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
