import { Dialog, Tabs, Tab, DialogTitle, List, ListItemButton, ListItemText, Button } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { parseJson } from '../SingleOffer';
import { routes } from '../../../const/routes';
import { OfferDraft } from '@prisma/client';
import { addMessage } from '../../../features/responseSnackbar/reducer';
import { useDispatch } from 'react-redux';
import { OpenDialogType } from './OpenDialogType';
import { RawDraftContentState } from 'draft-js';

export default function LoadRemoveDraftDialog({ openDialog, setOpenDialog, setBody, setTitle, drafts, mutate }: { openDialog: OpenDialogType, setOpenDialog: Dispatch<SetStateAction<OpenDialogType>>, setBody: Dispatch<SetStateAction<RawDraftContentState>>, setTitle: Dispatch<SetStateAction<string>>, drafts: OfferDraft[], mutate: () => void }) {
    const [removingDisabled, setRemovingDisabled] = useState(true);
    const [loadRemoveState, setLoadRemoveState] = useState<"load" | "remove">("load");
    useEffect(() => {
        setRemovingDisabled(true);
    }, [openDialog]);
    const dispatch = useDispatch();
    const removeDraft = (id: number) => {
        fetch(`${routes.api.drafts}`, {
            method: 'DELETE',
            body: JSON.stringify(id)
        }).then(data => {
            if (data.ok) {
                setOpenDialog("none");
                mutate();
            }
            dispatch(addMessage({
                errorMessage: 'Failed to delete draft',
                isError: !data.ok,
                isSuccess: data.ok,
                successMessage: 'Successfully deleted draft'
            }))
        }).catch(() => dispatch(addMessage({
            errorMessage: 'Failed to delete draft',
            isError: true,
            isSuccess: false,
            successMessage: 'Successfully deleted draft'
        })))
    }
    return (
        <Dialog open={openDialog === 'load/remove'} onClose={() => setOpenDialog('none')}>
            <Tabs value={loadRemoveState} onChange={(e, v) => setLoadRemoveState(v)}>
                <Tab label="Load" value="load" />
                <Tab label="Remove" value="remove" />
            </Tabs>
            <DialogTitle>Choose saved draft</DialogTitle>
            <List>
                {drafts?.map(draft => <ListItemButton disabled={loadRemoveState === 'remove' && removingDisabled} key={draft?.id} onClick={() => {
                    if (loadRemoveState === "load") {
                        setBody(parseJson(draft?.body));
                        setTitle(draft?.title);
                        setOpenDialog("none");
                    }
                    else {
                        removeDraft(draft?.id);
                    }
                }}>
                    <ListItemText primary={draft?.name} secondary={draft?.title} />
                </ListItemButton>)}
            </List>
            {loadRemoveState === 'remove' && removingDisabled && <Button onClick={() => setRemovingDisabled(false)}>Enable removing</Button>}
        </Dialog>
    )
}
