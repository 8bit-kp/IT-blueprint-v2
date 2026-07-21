// lib/notifications/notificationService.js
//
// Advisor Notification Service
// ──────────────────────────────────────────────────────────────────────────
// This module provides a clean interface for notifying Consltek advisors
// when a customer completes a Current State Assessment.
//
// CURRENT STATE: Logs to console only. No external services are called.
//
// INTEGRATION POINT (save route):
//   Call notifyAssessmentCompleted() in app/api/blueprint/save/route.js
//   when updateData._lastSavedStep === 7 (the final form step).
//   This indicates the customer has finished their assessment.
//   (The form has 7 steps: Steps 1–6 capture infra/security/operations; Step 7 is Applications Portfolio.)
//
//   Example:
//     if (updateData._lastSavedStep === 6) {
//       await notifyAssessmentCompleted({
//         userId,
//         companyName: updateData.companyName ?? "Unknown",
//         email:       updateData.email ?? "",
//         completedAt: new Date().toISOString(),
//       });
//     }
//
// ── Future integration options ─────────────────────────────────────────────
//
//   1. Email (Resend, SendGrid, AWS SES)
//      Set ADVISOR_NOTIFICATION_EMAIL in environment variables.
//      Replace the commented block below with real send logic.
//
//   2. Webhook (Zapier, Make, custom endpoint)
//      Set NOTIFICATION_WEBHOOK_URL in environment variables.
//      POST a JSON payload to the endpoint on each completion.
//
//   3. CRM (HubSpot, Salesforce, Pipedrive)
//      Use the CRM's API to create a contact + deal record.
//
//   4. Internal queue (BullMQ, AWS SQS, Upstash)
//      Enqueue a job for async processing (email + CRM in one job).
//
// ── Environment variables required (none active yet) ──────────────────────
//
//   ADVISOR_NOTIFICATION_EMAIL  — recipient address for advisor alerts
//   NOTIFICATION_WEBHOOK_URL    — webhook endpoint URL
//   CRM_API_KEY                 — CRM authentication key
//

/**
 * Notify a Consltek advisor that a customer has completed their assessment.
 *
 * @param {object} params
 * @param {string} params.userId      — MongoDB ObjectId string of the user
 * @param {string} params.companyName — Organisation name from Step 1
 * @param {string} params.email       — Contact email from Step 1
 * @param {string} params.completedAt — ISO 8601 timestamp of completion
 */
export async function notifyAssessmentCompleted({ userId, companyName, email, completedAt }) {
    // ── Structured log (always runs — visible in Vercel function logs) ──────
    console.log(
        `[NOTIFICATION] Assessment completed — company="${companyName}" email="${email}" userId="${userId}" completedAt="${completedAt}"`
    );

    // ── Email integration (uncomment when provider is ready) ────────────────
    //
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "noreply@itblueprint.consltek.com",
    //   to:   process.env.ADVISOR_NOTIFICATION_EMAIL,
    //   subject: `New Assessment: ${companyName}`,
    //   html: `<p>A new Current State Assessment has been completed.</p>
    //          <ul>
    //            <li><strong>Company:</strong> ${companyName}</li>
    //            <li><strong>Email:</strong> ${email}</li>
    //            <li><strong>Completed:</strong> ${completedAt}</li>
    //          </ul>`,
    // });

    // ── Webhook integration (uncomment when endpoint is ready) ───────────────
    //
    // if (process.env.NOTIFICATION_WEBHOOK_URL) {
    //   await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       event:       "assessment.completed",
    //       userId,
    //       companyName,
    //       email,
    //       completedAt,
    //     }),
    //   });
    // }

    // ── CRM integration (uncomment when CRM credentials are ready) ───────────
    //
    // await createCRMContact({ companyName, email, source: "it-blueprint", completedAt });
}
