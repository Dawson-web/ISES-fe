function getDaysSincePublished(dateString: string) {
  const publishedDate = new Date(dateString);
  const currentDate = new Date();

  // 计算时间差（毫秒）
  const timeDiff: number = currentDate - publishedDate;

  // 将时间差转换为天数
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
}

export { getDaysSincePublished };
