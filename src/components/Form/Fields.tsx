import { RHFRating } from './RHFRating';
import { RHFSlider } from './RHFSlider';
import { RHFTextField } from './RHFTextField';
import { RHFRadioGroup } from './RHFAudioGroup';
import { RHFPhoneInput } from './RHFPhoneInput';
import { RHFAutocomplete } from './RHFAutocomplete';
import { RHFSwitch, RHFMultiSwitch } from './RHFSwitch';
import { RHFSelect, RHFMultiSelect } from './RHFSelect';
import { RHFCheckbox, RHFMultiCheckbox } from './RHFCheckbox';
import { RHFDatePicker, RHFMobileDateTimePicker } from './RHFDatePicker';
import { RHFUpload, RHFUploadBox, RHFUploadAvatar, RHFSelectAvatar } from './RHFUpload';

// ----------------------------------------------------------------------

export const Field = {
  Select: RHFSelect,
  Upload: RHFUpload,
  Switch: RHFSwitch,
  Slider: RHFSlider,
  Rating: RHFRating,
  Text: RHFTextField,
  Phone: RHFPhoneInput,
  Checkbox: RHFCheckbox,
  UploadBox: RHFUploadBox,
  RadioGroup: RHFRadioGroup,
  DatePicker: RHFDatePicker,
  MultiSelect: RHFMultiSelect,
  MultiSwitch: RHFMultiSwitch,
  UploadAvatar: RHFUploadAvatar,
  SelectAvatar: RHFSelectAvatar,
  Autocomplete: RHFAutocomplete,
  MultiCheckbox: RHFMultiCheckbox,
  MobileDateTimePicker: RHFMobileDateTimePicker,
};
