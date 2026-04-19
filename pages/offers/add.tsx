import AddOffer from '../../components/common/AddOffer/AddOffer'
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

export default function Add() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <AddOffer />
    </LocalizationProvider>
  )
}
