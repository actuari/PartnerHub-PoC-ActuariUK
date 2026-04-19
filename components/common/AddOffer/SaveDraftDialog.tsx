import { Dialog, DialogTitle, TextField, Button } from '@mui/material';
import { routes } from '../../../const/routes';
import { addMessage } from '../../../features/responseSnackbar/reducer';
import { useDispatch } from 'react-redux';
import { Dispatch, SetStateAction, useState } from 'react';
import { RawDraftContentState } from 'draft-js';
import { OpenDialogType } from './OpenDialogType';

export default function SaveDraftDialog({ title, body, openDialog, setOpenDialog, mutate }: { title: string, body: RawDraftContentState, openDialog: OpenDialogType, setOpenDialog: Dispatch<SetStateAction<OpenDialogType>>, mutate: () => void }) {
    const dispatch = useDispatch();
    const [draftName, setDraftName] = useState("");
    const sendDraft = () => {
        fetch(`${routes.api.drafts}`, {
            method: 'POST',
            body: JSON.stringify({
                title,
                name: draftName,
                body: JSON.stringify(body),
            })
        }).then(data => {
            if (data.ok) {
                setOpenDialog("none");
                mutate();
            }
            dispatch(addMessage({
                errorMessage: 'Failed to save draft',
                isError: !data.ok,
                isSuccess: data.ok,
                successMessage: 'Successfully saved new draft'
            }))
        }).catch(() => dispatch(addMessage({
            errorMessage: 'Failed to save draft',
            isError: true,
            isSuccess: false,
            successMessage: 'Successfully saved new draft'
        })))
    }
    return (
        <Dialog open={openDialog === 'save'} onClose={() => setOpenDialog('none')}>
            <DialogTitle>Save Draft</DialogTitle>
            <TextField placeholder="Draft Name" value={draftName} onChange={e => setDraftName(e.target.value)} />
            <Button onClick={sendDraft}>Ok</Button>
        </Dialog>
    )
}
