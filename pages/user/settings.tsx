import { useFetch, useIsDesktop } from "../../hooks";
import { useGetEmail, useUserGuard } from "../../auth/client";
import { routes } from "../../const/routes";
import { User } from "../../types/User/Basic";
import LoaderCenter from "../../components/common/LoaderCenter";
import { Box } from "@mui/material";
import UserUpdateForm from "../../components/common/UserUpdateForm";
import { Degree, University } from "@prisma/client";
import { Major } from "../../types/Major";
import { prisma } from "../../prisma";
export async function getStaticProps() {
    const majors = await prisma.major
        .findMany({
            include: {
                category: true,
            },
            orderBy: {
                name: "asc",
            },
        })
    const universities = await prisma.university
        .findMany({
            orderBy: {
                name: "asc",
            },
        })
    const degrees = await prisma.degree
        .findMany({
            orderBy: {
                name: "asc",
            },
        })
    return {
        props: {
            majors,
            degrees,
            universities
        }
    }
}
type Props = {
    majors: Major[],
    degrees: Degree[],
    universities: University[]
}
export default function Account(props: Props) {
    const myEmail = useGetEmail();
    const { data: userData, isLoading, mutate } = useFetch(`${routes.api.users.basic}/${myEmail}`);
    const user: User | undefined = userData?.data;
    const isDesktop = useIsDesktop()
    useUserGuard(userSession => !!userSession && userSession?.email === user?.email);
    return isLoading ? <LoaderCenter /> : user ? (
        <Box padding={isDesktop ? 10 : 0}>
            <UserUpdateForm user={user} reloadUser={mutate} {...props} />
        </Box>
    ) : <></>;
};