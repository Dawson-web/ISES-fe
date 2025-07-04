// import ArticleItem from "@/components/article/article-item";
// import { getArticlePagination } from "@/service/article";
// import { IArticleDetail, IPaginationRequest } from "@/types/article";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { Pagination } from "@mantine/core";
// import News from "@/components/public/news";
// import { useDisclosure } from "@mantine/hooks";
// import UserProfile from "@/components/profile/UserProfile";
// import { toastMessage } from "@/components/toast";

// export default function Page() {
//   const [articles, setArticles] = useState<IArticleDetail[]>([]);
//   const [page, onChange] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [search] = useState("");
//   const totalPages = useMemo(() => Math.ceil(total / 6), [total]);
//   const [opened, { open, close }] = useDisclosure(false);
//   const userSelect = useRef("");

//   const handleGetArticleRecommand = async () => {
//     try {
//       const reqParams: IPaginationRequest = {
//         title: search,
//         page: page,
//         pageSize: 6,
//       };
//       const res = await getArticlePagination(reqParams);
//       setArticles(res.data.data.articles);
//       setTotal(res.data.data.pagination.total);
//     } catch (error) {
//       toastMessage.error(String(error));
//     }
//   };

//   useEffect(() => {
//     handleGetArticleRecommand();
//   }, [page, search]);
//   if (!articles.length) return null;
//   return (
//     <>
//       <News className="bg-[url('../../../public/cover.png')] sm:h-[30vh] h-[150px] w-full  bg-no-repeat bg-cover mb-4" />
//       <div className="w-full  gap-2 justity-between grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 ">
//         {articles.map((article) => {
//           return (
//             <ArticleItem
//               key={article.id}
//               article={article}
//               onClick={() => {
//                 userSelect.current = article.userInfoId;
//                 open();
//               }}
//             />
//           );
//         })}
//       </div>
//       <Pagination
//         total={totalPages}
//         value={page}
//         onChange={onChange}
//         onClick={() => window.scrollTo(0, 0)}
//         className="sm mt-8"
//       />
//       {opened && (
//         <UserProfile
//           opened={opened}
//           close={close}
//           userInfoId={userSelect.current}
//         />
//       )}
//     </>
//   );
// }

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}