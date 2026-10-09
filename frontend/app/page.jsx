"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import CourseForm from "@/components/CourseForm";
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "@/lib/courseApi";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCourses() {
    setIsLoading(true);
    setError("");

    try {
      const courseList = await getCourses();
      setCourses(courseList);
    } catch (loadError) {
      setError(loadError.message || "Courses could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleViewDetails(id) {
    setError("");

    try {
      const course = await getCourse(id);
      setSelectedCourse(course);
    } catch (detailsError) {
      setError(detailsError.message || "Course details could not be loaded.");
    }
  }

  async function handleSubmitCourse(course) {
    if (editingCourse) {
      const updatedCourse = await updateCourse(editingCourse.id, course);

      setCourses((currentCourses) =>
        currentCourses.map((item) =>
          item.id === updatedCourse.id ? updatedCourse : item,
        ),
      );
      setEditingCourse(null);
      return;
    }

    const newCourse = await createCourse(course);
    setCourses((currentCourses) => [newCourse, ...currentCourses]);
  }

  async function handleDeleteCourse(id) {
    const shouldDelete = window.confirm("Delete this course?");

    if (!shouldDelete) {
      return;
    }

    setError("");

    try {
      await deleteCourse(id);
      setCourses((currentCourses) =>
        currentCourses.filter((course) => course.id !== id),
      );

      if (selectedCourse?.id === id) {
        setSelectedCourse(null);
      }

      if (editingCourse?.id === id) {
        setEditingCourse(null);
      }
    } catch (deleteError) {
      setError(deleteError.message || "Course could not be deleted.");
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    function closeModalOnEscape(event) {
      if (event.key === "Escape") {
        setSelectedCourse(null);
      }
    }

    window.addEventListener("keydown", closeModalOnEscape);

    return () => {
      window.removeEventListener("keydown", closeModalOnEscape);
    };
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Course Management
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Assignment By Securium Solutions
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Full course crud application with Next.js 13, React, and Tailwind CSS. Add, edit, delete, and view course details.
            </p>
          </div>

          <button
            type="button"
            onClick={loadCourses}
            className="w-fit rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Refresh
          </button>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            {error ? (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                Loading courses...
              </div>
            ) : courses.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onDelete={handleDeleteCourse}
                    onEdit={setEditingCourse}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
                No courses found. Add the first course from the form.
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <CourseForm
              editingCourse={editingCourse}
              onCancelEdit={() => setEditingCourse(null)}
              onSubmitCourse={handleSubmitCourse}
            />
          </aside>
        </div>
      </div>

      {selectedCourse ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-detail-title"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Course details
                </p>
                <h2
                  id="course-detail-title"
                  className="mt-2 text-2xl font-bold text-slate-950"
                >
                  {selectedCourse.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Close
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {selectedCourse.description}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-sm">
              <div className="rounded-md bg-slate-50 p-3">
                <dt className="text-slate-500">Price</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {formatPrice(selectedCourse.price)}
                </dd>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <dt className="text-slate-500">Duration</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {selectedCourse.duration}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : null}
    </main>
  );
}
