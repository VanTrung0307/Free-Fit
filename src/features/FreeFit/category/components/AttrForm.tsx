import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PostAttr } from 'models';
import { Attr } from 'models/dto/attrResponse';
import { useTranslation } from 'react-i18next';

interface AttrFormProps {
  initialValue: Attr[];
  isView: boolean;
  id: number;
  onSubmit?: (formValue: PostAttr[]) => void;
  onBack?: () => void;
}

export default function AttrForm({ id, initialValue, onSubmit, isView, onBack }: AttrFormProps) {
  const { t } = useTranslation();
  const handleSubmit = (formValues) => {
    formValues.preventDefault();
    const postAttrList: PostAttr[] = [];
    // eslint-disable-next-line array-callback-return
    initialValue.map((e) => {
      postAttrList.push({
        attrId: e.id,
        value:
          e.formatField.type === 'check'
            ? formValues.target[e.name].checked.toString()
            : formValues.target[e.name].value,
      });
    });
    if (onSubmit) onSubmit(postAttrList);
  };
  // eslint-disable-next-line consistent-return
  const renderControl = (attr: Attr) => {
    switch (attr.formatField.type) {
      case 'select': {
        return (
          <FormControl key={attr.name}>
            <InputLabel id={`${attr.name}_label`}>{attr.name}</InputLabel>
            <Select
              labelId={`${attr.name}_label`}
              name={attr.name}
              key={attr.name}
              label={attr.name}
              defaultValue={attr.value === '0' ? '' : attr.value}
              disabled={isView}
              size="small"
            >
              {attr.formatField.selects.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
      case 'text': {
        return (
          <TextField
            fullWidth
            name={attr.name}
            label={attr.name}
            disabled={isView}
            defaultValue={attr.value}
            key={attr.name}
            size="small"
          />
        );
      }
      case 'number': {
        return (
          <TextField
            fullWidth
            name={attr.name}
            label={attr.name}
            disabled={isView}
            defaultValue={attr.value}
            key={attr.name}
            type="number"
            size="small"
          />
        );
      }
      case 'check': {
        return (
          <FormControlLabel
            control={<Checkbox key={attr.name} defaultChecked={attr.value === 'true'} />}
            label={attr.name}
            key={attr.name}
            disabled={isView}
            name={attr.name}
          />
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} key={id}>
      <Stack spacing={2} key={`Stack1-${id}`}>
        <Card sx={{ p: 2 }} key={`Stack2-${id}`}>
          <Stack key={`Stack3-${id}`} spacing={2}>
            {initialValue.map((e) => renderControl(e))}
          </Stack>
          {!isView && (
            <Box
              style={{
                display: 'flex',
                flexFlow: 'row nowrap',
                justifyContent: 'flex-end',
                alignContent: 'center',
                backgroundColor: '#fff',
                marginTop: '15px',
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  if (onBack) onBack();
                }}
                startIcon={<Icon icon={arrowCircleLeftOutline} />}
                style={{ marginRight: '15px' }}
              >
                {t('content.backHomePage')}
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Icon icon={saveFill} />}
              >
                {t('common.btnUpdate')}
              </LoadingButton>
            </Box>
          )}
        </Card>
      </Stack>
    </form>
  );
}
