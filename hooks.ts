import useMediaQuery from "@mui/material/useMediaQuery";
import useSWR from "swr";
const fetcher = (arg: string) => fetch(arg).then((res) => res.json());
export const useFetch = (
  path: string | (() => boolean | string | null),
  options?: any
) => {
  return useSWR(path, fetcher, {
    refreshInterval: 0,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    ...options,
  });
};

export const getCvSrc = (email: string) =>
  `https://storage.cloud.google.com/impactful-post-370720.appspot.com/${email}?authuser=0`;

export const getImageSrc = (email: string) =>
  `https://storage.cloud.google.com/staging.impactful-post-370720.appspot.com/${email}?authuser=0`;

export const useIsDesktop = () =>
  useMediaQuery((theme: any) => theme.breakpoints.up("md"));
