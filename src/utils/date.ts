function getDaysSincePublished(dateString: string) {
  const publishedDate = new Date(dateString);
  const currentDate = new Date();

  // 计算时间差（毫秒）
  const timeDiff: number = currentDate - publishedDate;

  // 将时间差转换为天数
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
}
function formatISODate(isoString: string): string {
  const date = new Date(isoString);
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hour = date.getUTCHours().toString().padStart(2, "0");
  const minute = date.getUTCMinutes().toString().padStart(2, "0");

  return `${month}-${day} ${hour}:${minute}`;
}
export { formatISODate, getDaysSincePublished };
