import { Degree, MajorCategory } from "@prisma/client";
import Offers from "../../components/offers/page";
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
  const majorCategories = await prisma.majorCategory
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
      majorCategories,
      degrees
    }
  }
}
type Props = {
  majors: Major[],
  majorCategories: MajorCategory[],
  degrees: Degree[]
}
export default function All(props: Props) {
  return <Offers degreeName="all" {...props} />
}
