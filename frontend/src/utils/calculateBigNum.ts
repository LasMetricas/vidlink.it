export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const hh = h > 0 ? `${h}:` : "";
  const mm = h > 0 ? String(m).padStart(2, "0") : `${m}`;
  const ss = String(s).padStart(2, "0");

  return `${hh}${mm}:${ss}`;
};

export const timeAgo = (createdAt: string): string => {
  const created = new Date(createdAt);
  const now = new Date();

  let years = now.getFullYear() - created.getFullYear();
  let months = now.getMonth() - created.getMonth();
  let days = now.getDate() - created.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [
    years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "",
    months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "",
    days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "",
  ].filter(Boolean);

  return parts.length ? `- ${parts.join(" ")} ago` : "- today";
};

export function formatBigNum(views: number): string {
  if (views < 1000) return views.toString();
  if (views < 1_000_000)
    return `${(views / 1000).toFixed(views >= 10000 ? 0 : 1)}k`;
  if (views < 1_000_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  return `${(views / 1_000_000_000).toFixed(1)}B`;
}
