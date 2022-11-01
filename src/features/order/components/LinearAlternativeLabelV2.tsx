import { useState } from 'react';
// material
import { Box, Step, Paper, Button, Stepper, StepLabel, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import arrowCircleLeftOutline from '@iconify/icons-eva/arrow-circle-left-outline';
import arrowCircleRightOutline from '@iconify/icons-eva/arrow-circle-right-outline';
import saveFill from '@iconify/icons-eva/save-fill';
import { Icon } from '@iconify/react';
import { OrderInformationForm } from './OrderInformationForm';
import { OrderInformationFormV2 } from './OrderInformationFormV2';
import { ToLocationForm } from './ToLocationForm';
import { FormLocationFormV2 } from './FormLocationFormV2';

// ----------------------------------------------------------------------
interface LinearAlternativeLabelProps {
  isSubmitting: boolean;
  isDirty: boolean;
  isView: boolean;
  isEdit: boolean;
}

export default function LinearAlternativeLabelV2({
  isSubmitting,
  isDirty,
  isView,
  isEdit,
}: LinearAlternativeLabelProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const { watch, trigger } = useFormContext();
  const [compiledForm, setCompiledForm] = useState({});
  const form = watch();
  const { t } = useTranslation();
  const steps = [t('order.start'), t('order.orderInfo')];
  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    switch (activeStep) {
      case 0: {
        if (!isView) {
          const check = await trigger([
            'fromStation.longitude',
            'fromStation.latitude',
            'fromStation.address',
            'fromStation.district',
            'fromStation.ward',
            'fromStation.city',
          ]);
          if (!check) return;
        }
        setCompiledForm({ ...compiledForm, one: form });
        break;
      }

      case 1:
        if (!isView) {
          const check = await trigger([
            'orderCode',
            'orderInfoObj.cod',
            'orderInfoObj.totalPriceOrder',
            'orderInfoObj.weight',
            'orderInfoObj.length',
            'orderInfoObj.width',
            'orderInfoObj.height',
            'orderInfoObj.note',
            'orderInfoObj.receiverName',
            'orderInfoObj.email',
            'orderInfoObj.phone',
            'orderInfoObj.serviceCharge',
            'orderInfoObj.incurred',
            'packageItems',
          ]);
          if (!check) return;
        }
        setCompiledForm({ ...compiledForm, three: form });
        break;
      default:
        // eslint-disable-next-line consistent-return
        return 'not a valid step';
    }
    if (isView) {
      if (activeStep === 1) {
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  // eslint-disable-next-line consistent-return
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    switch (activeStep) {
      case 1:
        setCompiledForm({ ...compiledForm, two: form });
        break;
      default:
        return 'not a valid step';
    }
  };
  function getStepContent(step, formContent) {
    switch (step) {
      case 0:
        return <FormLocationFormV2 isView={isView} />;
      case 1:
        return <OrderInformationFormV2 isView={isView} isEdit={isEdit} />;
      default:
        return 'Unknown step';
    }
  }

  return (
    <>
      <OrderInformationFormV2 isView={isView} isEdit={isEdit} />
      <Box sx={{ display: 'flex', pt: 2 }}>
        <Box sx={{ flexGrow: 1 }} />
        <LoadingButton
          variant="contained"
          onClick={handleNext}
          disabled={!isDirty}
          loading={isSubmitting}
          type="submit"
          startIcon={<Icon icon={saveFill} />}
        >
          {isEdit ? t('common.btnUpdate') : t('common.btnSubmit')}
        </LoadingButton>
      </Box>
    </>
  );
}
