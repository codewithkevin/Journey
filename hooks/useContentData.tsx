import { useCallback, useMemo, useState } from "react";
import contentData from "../dummy/posts.json";
import { IJob } from "@/types/job.types";
import { ICourse } from "@/types/courses.types";
import { IMentor } from "@/types/mentor.types";
import { IBlurb } from "@/types/blurbs.types";

export type ContentItem = IJob | ICourse | IMentor | IBlurb;

type FilterConfig = {
  [key: string]: (data: ContentItem[]) => ContentItem[];
};

export const useContentData = (tabName: string) => {
  const filterStrategies: FilterConfig = useMemo(
    () => ({
      "Find Mentors": (data) =>
        data.filter((item) => item.category === "mentorship"),
      Mentors: (data) => data.filter((item) => item.category === "mentorship"),
      Courses: (data) => data.filter((item) => item.category === "course"),
      Blurbs: (data) => data.filter((item) => item.category === "blurbs"),
      Jobs: (data) => data.filter((item) => item.category === "job"),
    }),
    []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const filteredData = useMemo(() => {
    const filterStrategy = filterStrategies[tabName] || (() => []);
    return filterStrategy(contentData);
  }, [tabName, filterStrategies]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      return filteredData;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, [tabName]);

  return {
    data: filteredData,
    loading,
    error,
    fetchData,
  };
};
