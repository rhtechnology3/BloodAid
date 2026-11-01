import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { pool, jsonError } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnyRow = RowDataPacket & Record<string, any>;

function publicUser(row: AnyRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    bloodGroup: row.bloodGroup,
    age: row.age,
  };
}
function errMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
async function bodyJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
function idFrom(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

export async function GET(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean).slice(1); // remove "api"
  try {
    if (parts[0] === "donors") {
      if (parts[1] && parts[1] !== "search") {
        const id = idFrom(parts[1]);
        if (!id) return jsonError("Invalid donor id.", 400);
        const [rows] = await pool.query<AnyRow[]>(
          "SELECT id, name, age, blood_group AS bloodGroup, phone, city, CAST(available AS UNSIGNED) AS available FROM donors WHERE id = ? LIMIT 1",
          [id],
        );
        if (!rows.length) return jsonError("Donor not found.", 404);
        return Response.json(rows[0]);
      }
      const bloodGroup = request.nextUrl.searchParams.get("bloodGroup")?.trim();
      const city = request.nextUrl.searchParams.get("city")?.trim();
      let sql =
        "SELECT id, name, age, blood_group AS bloodGroup, phone, city, CAST(available AS UNSIGNED) AS available FROM donors";
      const where: string[] = [];
      const params: unknown[] = [];
      if (bloodGroup) {
        where.push("blood_group = ?");
        params.push(bloodGroup);
      }
      if (city) {
        where.push("LOWER(city) LIKE LOWER(?)");
        params.push(`%${city}%`);
      }
      if (where.length) sql += " WHERE " + where.join(" AND ");
      sql += " ORDER BY id DESC";
      const [rows] = await pool.query<AnyRow[]>(sql, params);
      return Response.json(rows);
    }

    if (parts[0] === "auth" && parts[1] === "user") {
      const id = idFrom(parts[2]);
      if (!id) return jsonError("Invalid user id.", 400);
      const [rows] = await pool.query<AnyRow[]>(
        "SELECT id, name, email, phone, city, blood_group AS bloodGroup, age FROM users WHERE id = ? LIMIT 1",
        [id],
      );
      return rows.length
        ? Response.json(rows[0])
        : jsonError("User not found.", 404);
    }

    if (parts[0] === "requests") {
      if (parts[1] === "user") {
        const userId = idFrom(parts[2]);
        if (!userId) return jsonError("Invalid user id.", 400);
        const [users] = await pool.query<AnyRow[]>(
          "SELECT id FROM users WHERE id = ?",
          [userId],
        );
        if (!users.length) return jsonError("User not found.", 404);
        const [rows] = await pool.query<AnyRow[]>(
          "SELECT id, user_id AS userId, blood_group AS bloodGroup, units, city, hospital, required_date AS requiredDate, urgency, message, status, created_at AS createdAt FROM blood_requests WHERE user_id = ? ORDER BY created_at DESC",
          [userId],
        );
        return Response.json(rows);
      }
      if (parts[1] === "responses" && parts[2] === "user") {
        const userId = idFrom(parts[3]);
        if (!userId) return jsonError("Invalid user id.", 400);
        const [users] = await pool.query<AnyRow[]>(
          "SELECT id FROM users WHERE id = ?",
          [userId],
        );
        if (!users.length) return jsonError("User not found.", 404);
        const [rows] = await pool.query<AnyRow[]>(
          "SELECT id, request_id AS requestId, donor_user_id AS donorUserId, donor_name AS donorName, phone, blood_group AS bloodGroup, city, status, created_at AS createdAt FROM donor_responses WHERE donor_user_id = ? ORDER BY created_at DESC",
          [userId],
        );
        return Response.json(rows);
      }
      const requestId = idFrom(parts[1]);
      if (requestId && parts[2] === "responses") {
        const [rows] = await pool.query<AnyRow[]>(
          "SELECT id, request_id AS requestId, donor_user_id AS donorUserId, donor_name AS donorName, phone, blood_group AS bloodGroup, city, status, created_at AS createdAt FROM donor_responses WHERE request_id = ? ORDER BY created_at DESC",
          [requestId],
        );
        return Response.json(rows);
      }
      const [rows] = await pool.query<AnyRow[]>(
        "SELECT id, user_id AS userId, blood_group AS bloodGroup, units, city, hospital, required_date AS requiredDate, urgency, message, status, created_at AS createdAt FROM blood_requests WHERE status = 'Active' ORDER BY created_at DESC",
      );
      return Response.json(rows);
    }
    return jsonError("API endpoint not found.", 404);
  } catch (error) {
    console.error("BloodAid GET API error:", error);
    return jsonError(
      errMessage(
        error,
        "Database request failed. Check MySQL settings and schema.",
      ),
      500,
    );
  }
}

export async function POST(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean).slice(1);
  const body = await bodyJson(request);
  if (!body || typeof body !== "object")
    return jsonError("A valid JSON request body is required.", 400);

  try {
    if (parts[0] === "auth" && parts[1] === "signup") {
      const name = String(body.name || "").trim();
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      const password = String(body.password || "");
      if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return jsonError("Enter your name and a valid email address.");
      if (password.length < 6)
        return jsonError("Password must contain at least 6 characters.");
      const [existing] = await pool.query<AnyRow[]>(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email],
      );
      if (existing.length) return jsonError("Email already registered.", 409);
      const hash = await bcrypt.hash(password, 12);
      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO users (name, email, phone, password, city, blood_group, age) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          email,
          String(body.phone || "").trim(),
          hash,
          String(body.city || "").trim() || null,
          String(body.bloodGroup || "").trim() || null,
          Number(body.age || 0),
        ],
      );
      const [rows] = await pool.query<AnyRow[]>(
        "SELECT id, name, email, phone, city, blood_group AS bloodGroup, age FROM users WHERE id = ?",
        [result.insertId],
      );
      return Response.json(publicUser(rows[0]), { status: 201 });
    }

    if (parts[0] === "auth" && parts[1] === "login") {
      const email = String(body.email || "")
        .trim()
        .toLowerCase();
      const password = String(body.password || "");
      if (!email || !password)
        return jsonError("Email and password are required.");
      const [rows] = await pool.query<AnyRow[]>(
        "SELECT id, name, email, phone, password, city, blood_group AS bloodGroup, age FROM users WHERE email = ? LIMIT 1",
        [email],
      );
      if (!rows.length)
        return jsonError(
          "No account found for this email. Please sign up.",
          401,
        );

      const user = rows[0];
      const stored = String(user.password || "");
      let valid = false;

      if (/^\$2[aby]\$\d{2}\$/.test(stored)) {
        valid = await bcrypt.compare(password, stored);
      } else {
        // Support legacy plain-text passwords and upgrade them to bcrypt.
        valid = password === stored;

        if (valid) {
          const hash = await bcrypt.hash(password, 12);
          await pool.execute("UPDATE users SET password = ? WHERE id = ?", [
            hash,
            user.id,
          ]);
        }
      }

      if (!valid) {
        return jsonError("Incorrect password. Please try again.", 401);
      }

      return Response.json(publicUser(user));
    }

    if (parts[0] === "donors" && !parts[1]) {
      const name = String(body.name || "").trim();
      const age = Number(body.age || 0);
      const bloodGroup = String(body.bloodGroup || "").trim();
      const phone = String(body.phone || "").trim();
      const city = String(body.city || "").trim();
      if (!name || !bloodGroup || !phone || !city)
        return jsonError("Name, phone, blood group and city are required.");
      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO donors (name, age, blood_group, phone, city, available) VALUES (?, ?, ?, ?, ?, ?)",
        [
          name,
          Number.isFinite(age) ? age : 0,
          bloodGroup,
          phone,
          city,
          body.available === false ? 0 : 1,
        ],
      );
      const [rows] = await pool.query<AnyRow[]>(
        "SELECT id, name, age, blood_group AS bloodGroup, phone, city, CAST(available AS UNSIGNED) AS available FROM donors WHERE id = ?",
        [result.insertId],
      );
      return Response.json(rows[0], { status: 201 });
    }

    if (parts[0] === "requests" && parts.length === 1) {
      const userId = idFrom(String(body.userId ?? ""));
      if (!userId)
        return jsonError("Please log in again before creating a request.", 401);
      const [users] = await pool.query<AnyRow[]>(
        "SELECT id FROM users WHERE id = ?",
        [userId],
      );
      if (!users.length)
        return jsonError("Please log in again before creating a request.", 401);
      const bloodGroup = String(body.bloodGroup || "").trim();
      const units = Number(body.units);
      const city = String(body.city || "").trim();
      const urgency = String(body.urgency || "").trim();
      if (
        !bloodGroup ||
        !Number.isInteger(units) ||
        units < 1 ||
        !city ||
        !urgency
      )
        return jsonError("Blood group, units, city and urgency are required.");
      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO blood_requests (user_id, blood_group, units, city, hospital, required_date, urgency, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active', NOW())",
        [
          userId,
          bloodGroup,
          units,
          city,
          String(body.hospital || "").trim() || null,
          String(body.requiredDate || "").trim() || null,
          urgency,
          String(body.message || "").trim() || null,
        ],
      );
      const [rows] = await pool.query<AnyRow[]>(
        "SELECT id, user_id AS userId, blood_group AS bloodGroup, units, city, hospital, required_date AS requiredDate, urgency, message, status, created_at AS createdAt FROM blood_requests WHERE id = ?",
        [result.insertId],
      );
      return Response.json(rows[0], { status: 201 });
    }

    if (parts[0] === "requests" && parts[1] && parts[2] === "respond") {
      const requestId = idFrom(parts[1]);
      const userId = idFrom(String(body.userId ?? ""));
      if (!userId) return jsonError("Please log in to respond.", 401);
      if (!requestId) return jsonError("Invalid request id.");
      const [users] = await pool.query<AnyRow[]>(
        "SELECT id, name, phone, blood_group AS bloodGroup, city FROM users WHERE id = ? LIMIT 1",
        [userId],
      );
      const [requests] = await pool.query<AnyRow[]>(
        "SELECT id, user_id AS userId FROM blood_requests WHERE id = ? LIMIT 1",
        [requestId],
      );
      if (!users.length || !requests.length)
        return jsonError("User or blood request not found.", 404);
      if (Number(requests[0].userId) === userId)
        return jsonError("You cannot respond to your own request.");
      const [dupes] = await pool.query<AnyRow[]>(
        "SELECT id FROM donor_responses WHERE request_id = ? AND donor_user_id = ? LIMIT 1",
        [requestId, userId],
      );
      if (dupes.length)
        return jsonError("You have already responded to this request.", 409);
      const user = users[0];
      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO donor_responses (request_id, donor_user_id, donor_name, phone, blood_group, city, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'Interested', NOW())",
        [requestId, userId, user.name, user.phone, user.bloodGroup, user.city],
      );
      const [rows] = await pool.query<AnyRow[]>(
        "SELECT id, request_id AS requestId, donor_user_id AS donorUserId, donor_name AS donorName, phone, blood_group AS bloodGroup, city, status, created_at AS createdAt FROM donor_responses WHERE id = ?",
        [result.insertId],
      );
      return Response.json(rows[0], { status: 201 });
    }
    return jsonError("API endpoint not found.", 404);
  } catch (error: any) {
    console.error("BloodAid POST API error:", error);
    if (error?.code === "ER_DUP_ENTRY")
      return jsonError("This record already exists.", 409);
    if (
      error?.code === "ER_NO_SUCH_TABLE" ||
      error?.code === "ECONNREFUSED" ||
      error?.code === "ER_ACCESS_DENIED_ERROR"
    ) {
      return jsonError(
        "Could not connect to MySQL. Check .env.local and run database/schema.sql in MySQL Workbench.",
        500,
      );
    }
    return jsonError(errMessage(error, "Database request failed."), 500);
  }
}
