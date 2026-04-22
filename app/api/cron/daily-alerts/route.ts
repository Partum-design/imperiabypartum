import { NextResponse } from "next/server";

import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createServiceRoleClient();
  const today = new Date();
  const todayDate = today.toISOString().slice(0, 10);

  const { data: alreadyRan } = await supabase
    .from("alert_jobs_log")
    .select("run_date")
    .eq("run_date", todayDate)
    .maybeSingle();

  if (alreadyRan) {
    return NextResponse.json({ ok: true, skipped: true, reason: "already_processed_today" });
  }

  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);
  const expiryLimit = in30Days.toISOString().slice(0, 10);

  const [{ data: expiringAssets, error: assetsError }, { data: birthdays, error: birthdaysError }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("id, name, expires_at")
      .lte("expires_at", expiryLimit),
    supabase
      .from("users")
      .select("id, full_name, birthday")
      .not("birthday", "is", null),
  ]);

  if (assetsError || birthdaysError) {
    return NextResponse.json(
      { ok: false, message: "Error reading source data", details: { assetsError, birthdaysError } },
      { status: 500 },
    );
  }

  const birthdayToday = (birthdays ?? []).filter((user) => {
    if (!user.birthday) return false;
    return user.birthday.slice(5) === todayDate.slice(5);
  });

  const alerts = [
    ...(expiringAssets ?? []).map((asset) => ({
      type: "vencimiento",
      title: "Activo por vencer",
      message: `El activo ${asset.name} vence el ${asset.expires_at}.`,
      entity_id: asset.id,
      entity_table: "subscriptions",
      user_id: null,
    })),
    ...birthdayToday.map((person) => ({
      type: "cumpleanos",
      title: "Cumpleanos del dia",
      message: `Hoy cumpleanos de ${person.full_name}.`,
      entity_id: person.id,
      entity_table: "users",
      user_id: null,
    })),
  ];

  if (alerts.length > 0) {
    const { error: insertError } = await supabase.from("notifications").insert(alerts);

    if (insertError) {
      return NextResponse.json({ ok: false, message: "Error inserting alerts", details: insertError }, { status: 500 });
    }
  }

  await supabase.from("alert_jobs_log").insert({ run_date: todayDate, total_alerts: alerts.length });

  // TODO: integrate email provider and Web Push sender here.
  // Suggested flow:
  // 1) Query push_subscriptions.
  // 2) Send push by VAPID/web-push.
  // 3) Send emails (Resend/SMTP) for critical alerts.

  return NextResponse.json({ ok: true, processed: alerts.length, date: todayDate });
}
