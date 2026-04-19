import { Grid, List, Slide } from "@mui/material";
import React from "react";
import { Offer } from "../../types/Offer/WithoutApplicants";
import SingleOffer from "./SingleOffer";
import { User } from "../../types/User/Detailed";
import LoaderCenter from "./LoaderCenter";
import { useUser } from "../../auth/client";

export default function OffersList(props: { offers: Offer[]; mutate?: () => void; userData?: User; micro?: boolean; isLoading: boolean; sizeMultiplier?: number }) {
  const user = useUser();
  const userId = user?.id;
  const mult = props.sizeMultiplier || 1
  return (
    <Grid container>
      <Grid item xs={12}>
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Grid container flexWrap={"wrap"} spacing={1}>
            {
              props.offers.map(offer => <Grid item key={offer?.id} md={4 * mult} sm={6 * mult} xs={12 * mult}>
                <SingleOffer offer={offer} userId={userId} mutate={props.mutate} userData={props.userData} micro={props.micro} />
              </Grid>)
            }
          </Grid>
        </Slide>
      </Grid>
      <Grid item xs={12}>
        {props.isLoading && <LoaderCenter />}
      </Grid>
    </Grid>
  );
}
