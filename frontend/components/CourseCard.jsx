export default function CourseCard({ course, onDelete, onEdit, onViewDetails }) {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(course.price);

  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h2 className="text-xl font-semibold text-slate-950">{course.name}</h2>
          <span className="w-fit rounded-md bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {formattedPrice}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{course.description}</p>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-medium text-slate-500">{course.duration}</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(course.id)}
            className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onEdit(course)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(course.id)}
            className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
