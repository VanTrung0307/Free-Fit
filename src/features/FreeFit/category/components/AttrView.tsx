import { Checkbox, FormControlLabel, Stack } from '@mui/material';
import TypographyDetails from 'components/TypographyDetails';
import { Attr } from 'models/dto/attrResponse';

interface AttrFormProps {
  initialValue: Attr[];
  id: number;
}

export default function AttrView({ id, initialValue }: AttrFormProps) {
  // eslint-disable-next-line consistent-return
  const renderControl = (attr: Attr) => {
    switch (attr.formatField.type) {
      case 'select': {
        return (
          <TypographyDetails title={attr.name} content={attr.value} key={`attr-select-${id}`} />
        );
      }
      case 'text': {
        return (
          <TypographyDetails
            title={attr.name}
            content={attr.value}
            key={`attr-text-${id}-${attr.name}`}
          />
        );
      }
      case 'number': {
        return (
          <TypographyDetails
            title={attr.name}
            content={attr.value}
            key={`attr-number-${id}-${attr.name}`}
          />
        );
      }
      case 'check': {
        return (
          <FormControlLabel
            control={<Checkbox key={attr.name} defaultChecked={attr.value === 'true'} />}
            label={attr.name}
            disabled={true}
            name={attr.name}
            key={`attr-check-${id}-${attr.name}`}
          />
        );
      }
    }
  };

  return (
    <Stack spacing={2} key={`Stack1-${id}`}>
      {initialValue.map((e) => renderControl(e))}
    </Stack>
  );
}
