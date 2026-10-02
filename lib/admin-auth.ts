import { env } from "cloudflare:workers";
import { redirect } from "next/navigation";
import { getChatGPTUser, requireChatGPTUser } from "@/app/auth";

function ownerEmail() {
  return (env.OWNER_EMAIL || process.env.OWNER_EMAIL || "").trim().toLowerCase();
}

function isAllowed(email: string) {
  if (process.env.NODE_ENV !== "production" && email === "seedy@sites.test") return true;
  const configured = ownerEmail();
  return Boolean(configured) && email.toLowerCase() === configured;
}

export async function requireOwner(returnTo: string) {
  const user = await requireChatGPTUser(returnTo);
  if (!isAllowed(user.email)) redirect("/?notice=not-owner");
  return user;
}

export async function getOwnerApiAccess() {
  const user = await getChatGPTUser();
  if (!user) return { ok: false as const, status: 401, message: "请先登录。" };
  if (!isAllowed(user.email)) return { ok: false as const, status: 403, message: "此账号没有管理权限。" };
  return { ok: true as const, user };
}
