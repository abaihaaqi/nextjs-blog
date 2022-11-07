import ReactMarkdown from "react-markdown";
import Date from "~/components/function/date";
import Layout from "~/components/Layout";
import { getAllPostIds, getPostData } from "~/lib/posts";
import Disqus from "disqus-react";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { useEffect } from "react";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  const metaContent = {
    url: postData.id,
    title: postData.title,
    description: postData.desc,
    img: postData.img,
  };

  const shortname = "nizar-baihaqi";
  const disqusConfig = {
    url: `https://blog.nizarbaihaqi.com/post/${postData.id}`,
    identifier: postData.id,
    title: postData.title,
  };

  useEffect(() => {
    const article = document.querySelector("article");

    const headings = Array.from(
      article.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );

    headings.map((heading) => (heading.className = "scroll-mt-[50px]"));

    const footnotes = Array.from(
      article.querySelectorAll(".footnotes > ol > li")
    );
    footnotes.map((item) => (item.className = "scroll-mt-[50px]"));

    const references = Array.from(article.querySelectorAll("p > sup > a"));
    references.map((item) => (item.className = "scroll-mt-[50px]"));
  });

  return (
    <Layout
      title={postData.title}
      img={postData.img}
      topics={postData.topics}
      metaContent={metaContent}
    >
      <div className="bg-zinc-900 rounded-lg p-4 mb-3">
        <p className="py-0">
          {postData.author} - <Date dateString={postData.date} />
        </p>
        <ReactMarkdown
          children={postData.content}
          remarkPlugins={[remarkGfm, [remarkToc, { heading: "Daftar Isi" }]]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
          linkTarget={(href) => {
            const regexp = /https:\/\//;
            if (href.match(regexp)) {
              return "_blank";
            }
          }}
        />
      </div>
      <div className="bg-white rounded-lg px-3">
        <Disqus.DiscussionEmbed shortname={shortname} config={disqusConfig} />
      </div>
    </Layout>
  );
}
