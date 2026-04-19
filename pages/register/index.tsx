import { useIsDesktop } from "../../hooks";
import RegisterForm from "../../components/common/RegisterForm";
import { Box } from "@mui/material";
import { routes } from "../../const/routes";
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
export default function Register(props: Props) {
  const isDesktop = useIsDesktop();
  return (
    <Box padding={isDesktop ? 10 : 0}>
      <RegisterForm {...props} />
    </Box>
  )
}

