const COURSE_API_URL =
  process.env.API_URL || "http://localhost:5000/courses";

async function readResponse(response) {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = Array.isArray(body.errors)
      ? body.errors.map((error) => error.message).join(" ")
      : "";

    throw new Error(validationMessage || body.message || "Request failed.");
  }

  return body;
}

export async function getCourses() {
  const response = await fetch(COURSE_API_URL, { cache: "no-store" });
  const body = await readResponse(response);

  return body.data || [];
}

export async function getCourse(id) {
  const response = await fetch(`${COURSE_API_URL}/${id}`, { cache: "no-store" });
  const body = await readResponse(response);

  return body.data;
}

export async function createCourse(course) {
  const response = await fetch(COURSE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });
  const body = await readResponse(response);

  return body.data;
}

export async function updateCourse(id, course) {
  const response = await fetch(`${COURSE_API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });
  const body = await readResponse(response);

  return body.data;
}

export async function deleteCourse(id) {
  const response = await fetch(`${COURSE_API_URL}/${id}`, {
    method: "DELETE",
  });

  await readResponse(response);
}
