import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../const/routes";
import { prioritySelector } from "../features/userPriority/selector";
import { Employer } from "../types/Employer";
import { User } from "../types/User/Detailed";
import { useFetch } from "../hooks";
import { setPriority } from "../features/userPriority/reducer";

export const useRegister = () => {
  const { data: session } = useSession();
  const [name, surname] = session?.user?.name?.split(" ") || [];
  const email = session?.user?.email;
  return {
    name,
    surname,
    email,
  };
};

const useCredentials: (stayIfEmpty?: boolean) =>
  | {
      user: User | undefined;
      employer: Employer | undefined;
      hasBothAccounts: boolean | undefined;
    }
  | null
  | undefined = (stayIfEmpty) => {
  const priority = useSelector(prioritySelector);
  const router = useRouter();
  const { status } = useSession();
  const { data: userData, isLoading: isUserLoading } = useFetch(() =>
    status === "authenticated" ? routes.api.users.email : null
  );
  const { data: employerData, isLoading: isEmployerLoading } = useFetch(() =>
    status === "authenticated" ? routes.api.employers.email : null
  );
  const isLoading = isUserLoading || isEmployerLoading;
  const user = userData?.data;
  const employer = employerData?.data;
  useEffect(() => {
    if (
      !isLoading &&
      user === null &&
      employer === null &&
      (!stayIfEmpty || status === "authenticated")
    ) {
      router.push("/register");
    }
  }, [isLoading, user, employer, stayIfEmpty, status]);
  if (isLoading) {
    return undefined;
  }
  return status === "authenticated"
    ? {
        user: priority === "user" || !employer ? user : null,
        employer: priority === "employer" || !user ? employer : null,
        hasBothAccounts: !!user && !!employer,
      }
    : null;
};

export const useUser: (stayIfEmpty?: boolean) => User | undefined = (
  stayIfEmpty
) => {
  return useCredentials(stayIfEmpty)?.user;
};

export const useEmployer: (stayIfEmpty?: boolean) => Employer | undefined = (
  stayIfEmpty
) => {
  return useCredentials(stayIfEmpty)?.employer;
};

export const sessionDataToEmail = (
  session: Session | null
): string | undefined => session?.user?.email || undefined;

export const useGetEmail: () => string | undefined = () => {
  const { data: session } = useSession();
  return sessionDataToEmail(session);
};

export const useHasBothAccounts: (
  stayIfEmpty?: boolean
) => boolean | undefined = (stayIfEmpty) => {
  return useCredentials(stayIfEmpty)?.hasBothAccounts;
};

export const useGetToken = () => {
  const { data: session } = useSession();
  return session?.user?.email;
};

export const useUserGuard = (canEnter: (user: User) => boolean) => {
  const router = useRouter();
  const credentials = useCredentials();
  const user = credentials?.user;
  const hasBothAccounts = useHasBothAccounts();
  const dispatch = useDispatch();
  useEffect(() => {
    if (credentials === undefined) {
      return;
    }
    if (!user || !canEnter(user)) {
      if (hasBothAccounts) {
        dispatch(setPriority("user"));
      } else {
        router.push("/");
      }
      //router.push(credentials?.hasBothAccounts ? "/" : "/api/auth/signin");
    }
  }, [canEnter, user]);
};

export const useEmployerGuard = (canEnter: (employer: Employer) => boolean) => {
  const router = useRouter();
  const credentials = useCredentials();
  const employer = credentials?.employer;
  const hasBothAccounts = useHasBothAccounts();
  const dispatch = useDispatch();
  useEffect(() => {
    if (credentials === undefined) {
      return;
    }
    if (!employer || !canEnter(employer)) {
      if (hasBothAccounts) {
        dispatch(setPriority("user"));
      } else {
        router.push("/");
      }
      //router.push(credentials?.hasBothAccounts ? "/" : "/api/auth/signin");
    }
  }, [canEnter, employer]);
};
