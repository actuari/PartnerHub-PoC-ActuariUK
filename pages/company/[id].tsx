import { Avatar, Box, Card, CardContent, Grid, Link, Slide, Typography } from "@mui/material";
import { getImageSrc, useFetch, useIsDesktop } from "../../hooks";
import { routes } from "../../const/routes";
import { useRouter } from "next/router";
import LoaderCenter from "../../components/common/LoaderCenter";
import EditorContent from "../../components/common/EditorContent";
import { parseJson } from "../../components/common/SingleOffer";
import { Company } from "../../types/Company";
import OffersList from "../../components/common/OffersList";
import { Offer } from "../../types/Offer/WithoutApplicants";
export default function Account() {
  const router = useRouter();
  const companyId = router.query?.id || "";
  const { data: companyData, isLoading: isCompanyLoading } = useFetch(`${routes.api.companies}/${companyId}/basic`);
  const company: Company | undefined = companyData?.data;
  const { data: offersData, isLoading: areOffersLoading, mutate } = useFetch(`${routes.api.offers.$}?companies=${company?.name}`)
  const offers: Offer[] = offersData?.data || [];
  const isLoading = isCompanyLoading || areOffersLoading;
  const isDesktop = useIsDesktop();
  return isLoading ? <LoaderCenter /> : company ? (
    <Box paddingX={isDesktop ? 2 : 0}>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        <Grid container padding={5} spacing={1} justifyContent={isDesktop ? "-moz-initial" : "center"}>
          <Grid item>
            <Avatar src={getImageSrc(company?.name)} sx={{ width: '150px', height: '150px' }} />
          </Grid>
          <Grid item alignSelf="end">
            <Link href={company?.link} color="inherit" underline="none">
              <Typography variant="h3">{company?.name}</Typography>
            </Link>
          </Grid>
        </Grid>
      </Slide>
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', background: '#f6f6f6' }}>
              <CardContent>
                <Typography variant="h4">Description</Typography>
                <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <EditorContent content={parseJson(company?.description || "")} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', background: '#f6f6f6' }}>
              <CardContent>
                <Typography variant="h4">Offers</Typography>
                <OffersList offers={offers} isLoading={isLoading} mutate={mutate} sizeMultiplier={isDesktop ? 12 / 8 : 1} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Slide>
    </Box>
  ) : <></>;
}
