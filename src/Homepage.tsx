import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Layout from "./components/Layout";
import RosterGrid from "./components/RosterGrid";

interface NewsItem {
  id: number;
  title: string;
  publish_date: string;
  is_public: boolean;
}

const NEWS_URL = "/api/news/";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`${url} -> ${res.status} ${res.statusText}`);
  }

  return res.json();
}

function scrollToRoster(): boolean {
  const roster = document.getElementById("roster");

  if (!roster) return false;

  roster.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  return true;
}

const Homepage: React.FC = () => {
  const location = useLocation();

  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const shouldGoRoster =
      location.hash === "#roster" ||
      location.state?.scrollTo === "roster";

    if (!shouldGoRoster) return;

    let tries = 0;

    const tick = () => {
      tries += 1;

      const didScroll = scrollToRoster();

      if (!didScroll && tries < 5) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [location.hash, location.state]);

  useEffect(() => {
    let cancelled = false;

    fetchJson<NewsItem[]>(NEWS_URL)
      .then((items) => {
        if (cancelled) return;

        const latest = (items ?? [])
          .filter((item) => item.is_public)
          .sort(
            (a, b) =>
              new Date(b.publish_date).getTime() -
              new Date(a.publish_date).getTime(),
          )
          .slice(0, 3);

        setLatestNews(latest);
      })
      .catch((error) => {
        console.error("Failed to load latest news", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout>
      <section className="bg-black px-4 py-8 text-white">
        <div className="mt-10 mx-auto max-w-6xl">
          <div className="mb-6">
            <h2
              className="text-xl font-semibold text-white"
              style={{
                textShadow: "0 0 4px rgba(127, 29, 29, 0.25)",
              }}
            >
              Latest from N5M
            </h2>

            <div className="mt-2 h-px w-16 bg-red-700/60" />
          </div>

          <div className="divide-y divide-white/10 border-b border-white/10">
            {latestNews.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="flex items-center justify-between gap-4 py-4 transition hover:text-[#e8d6a8]"
              >
                <span className="line-clamp-1 text-sm">
                  {item.title}
                </span>

                <span className="shrink-0 text-white/35">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="roster">
        <RosterGrid />
      </section>
    </Layout>
  );
};

export default Homepage;