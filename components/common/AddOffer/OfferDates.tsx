import { Grid, TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { Moment } from "moment";
import { useIsDesktop } from "../../../hooks";
import { Dispatch, SetStateAction } from "react";
import { formatIsoString } from "./formatIsoString";

export default function OfferDates({ due, setDue, finishDate, setFinishDate }: { due: string, setDue: Dispatch<SetStateAction<string>>, finishDate: string, setFinishDate: Dispatch<SetStateAction<string>> }) {
    const isDesktop = useIsDesktop();
    return (
        <Grid container spacing={2}
            mt={1}
            justifyContent="space-between"
        >
            <Grid item xs={12} md={6}>
                <MobileDatePicker
                    label="Applications deadline"
                    inputFormat="MM/DD/YYYY"
                    className="date_picker"
                    value={due}
                    onChange={(val: Moment | null) => setDue(formatIsoString(val?.add(1, 'days')?.toISOString()))}
                    renderInput={(params) => <TextField {...params} fullWidth={!isDesktop} error={false} />}
                />
            </Grid>
            <Grid item xs={12} md={6} textAlign="right">
                <MobileDatePicker
                    label="Project Finish Date"
                    inputFormat="MM/DD/YYYY"
                    value={finishDate}
                    onChange={(val: Moment | null) => setFinishDate(formatIsoString(val?.add(1, 'days')?.toISOString()))}
                    renderInput={(params) => <TextField {...params} fullWidth={!isDesktop} error={false} />}
                />
            </Grid>
        </Grid>

    )
}
