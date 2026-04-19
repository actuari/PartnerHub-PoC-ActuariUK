import {
    Button, Grid, TextField,
    Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, useCallback, useState } from "react";
import { useRouter } from "next/router";
import SingleOffer from "../SingleOffer";
import { Degree, OfferDraft } from "@prisma/client";
import { useEmployer, useEmployerGuard } from "../../../auth/client";
import { useFetch, useIsDesktop } from "../../../hooks";
import { useDispatch } from "react-redux";
import { addMessage } from "../../../features/responseSnackbar/reducer";
import { routes } from "../../../const/routes";
import { convertToRaw, EditorState } from "draft-js";
import TextEditor from "../TextEditor";
import LoaderCenter from "../LoaderCenter";
import SaveDraftDialog from "./SaveDraftDialog";
import LoadRemoveDraftDialog from "./LoadRemoveDraftDialog";
import OfferProperties from "./OfferProperties";
import OfferDates from "./OfferDates";
import { OpenDialogType } from "./OpenDialogType";
import { formatIsoString } from "./formatIsoString";
import { Major } from "../../../types/Major";

export default function Home() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState(convertToRaw(EditorState.createEmpty().getCurrentContent()));
    const router = useRouter();
    const [major, setMajor] = useState<Major | null>(null);
    const dispatch = useDispatch();
    const employer = useEmployer();
    const company = employer?.company;

    const [degree, setDegree] = useState<Degree | null>(null);
    const [due, setDue] = useState("");
    const [finishDate, setFinishDate] = useState("");
    const handleTitleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setTitle(event.target.value);
        },
        [setTitle]
    );
    const clearInput = () => {
        setTitle("");
        setBody(convertToRaw(EditorState.createEmpty().getCurrentContent()));
        setDue("");
        setDegree(null);
        setFinishDate("");
        setMajor(null);
    };
    const navigateBack = useCallback(() => {
        router.back();
    }, [router]);
    const addOffer = () => {
        fetch(`${routes.api.offers.add}`, {
            method: "POST",
            body: JSON.stringify({
                title,
                body: JSON.stringify(body),
                employerId: company?.id!,
                targetMajorId: major?.id!,
                targetDegreeId: degree?.id!,
                publishedAt: formatIsoString(new Date().toISOString()),
                due,
                finishDate
            }),
        })
            .then((data) =>
                dispatch(addMessage({ isSuccess: data.ok, isError: !data.ok, successMessage: 'Successfully added a new offer', errorMessage: 'Failed to add a new offer' }))
            )
            .then(clearInput)
            .catch(() =>
                dispatch(addMessage({ isSuccess: false, isError: true, successMessage: 'Successfully added a new offer', errorMessage: 'Failed to add a new offer' }))
            );
    }

    const [openDialog, setOpenDialog] = useState<OpenDialogType>("none");
    const openSaveDialog = () => {
        setOpenDialog("save")
    }
    const openLoadDialog = () => {
        setOpenDialog("load/remove")
    }
    useEmployerGuard(employer => !!employer && employer?.canAddOffers);
    const isDesktop = useIsDesktop();
    const { data: draftsData, isLoading: areDraftsLoading, mutate } = useFetch(routes.api.drafts);
    const drafts: OfferDraft[] = draftsData?.data || [];
    return areDraftsLoading ? <LoaderCenter /> : (
        <div>
            <Box
                width={isDesktop ? "70%" : "100%"}
                margin="auto"
                padding={isDesktop ? 5 : 0}
                mt={isDesktop ? 5 : 0}
                boxShadow="8px 8px 24px 0px rgba(66, 68, 90, 1)"
            >
                <SaveDraftDialog body={body} mutate={mutate} openDialog={openDialog} setOpenDialog={setOpenDialog} title={title} />
                <LoadRemoveDraftDialog openDialog={openDialog} setBody={setBody} setOpenDialog={setOpenDialog} setTitle={setTitle} drafts={drafts} mutate={mutate} />
                <Grid container spacing={2} mt={0}>
                    <Grid item xs={12}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            value={title}
                            fullWidth
                            onChange={handleTitleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} mt={0} sx={{ width: "100%" }} justifyContent="center">
                    <Grid item>
                        <TextEditor handleContent={setBody} value={body} />
                    </Grid>
                </Grid>
                <OfferProperties degree={degree} major={major} setDegree={setDegree} setMajor={setMajor} />
                <OfferDates due={due} finishDate={finishDate} setDue={setDue} setFinishDate={setFinishDate} />
                <Grid container spacing={2}
                    mt={1}
                    justifyContent="space-between"
                >
                    <Grid item xs={6}>
                        <Button onClick={openSaveDialog}>Save</Button>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Button onClick={openLoadDialog}>Load/Remove</Button>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={2}
                    mt={0}
                    sx={{ width: "100%" }}
                    display={title || body ? "inherit" : "none"}
                >
                    <Grid item sx={{ width: "100%" }}>
                        <Typography>Preview:</Typography>
                    </Grid>
                    <Grid item sx={{ width: "100%" }}>
                        <SingleOffer
                            offer={{
                                title,
                                body: JSON.stringify(body),
                                id: 0,
                                employer: company!,
                                employerId: 0,
                                targetMajor: major!,
                                targetMajorId: major?.id!,
                                targetDegree: degree!,
                                targetDegreeId: degree?.id!,
                                publishedAt: formatIsoString(new Date().toISOString()),
                                due,
                                finishDate,
                            }}
                            detailed
                        />
                    </Grid>
                </Grid>
                <Grid container justifyContent="space-around" spacing={2} mt={5}>
                    <Grid item>
                        <Button variant="contained" color="inherit" onClick={navigateBack}>
                            Back
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={addOffer}
                            disabled={!major || !company || !degree || !due.length || !finishDate.length}
                        >
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
