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
import { ToLocationForm } from './ToLocationForm';
import { FormLocationForm } from './FormLocationForm';

// ----------------------------------------------------------------------
interface LinearAlternativeLabelProps {
  isSubmitting: boolean;
  isDirty: boolean;
  isView: boolean;
  isEdit: boolean;
}

export default function LinearAlternativeLabel({
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
  const steps = [t('order.start'), t('order.end'), t('order.orderInfo')];
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
      case 1: {
        if (!isView) {
          const check = await trigger([
            'toStation.longitude',
            'toStation.latitude',
            'toStation.address',
            'toStation.district',
            'toStation.ward',
            'toStation.city',
          ]);
          if (!check) return;
        }
        setCompiledForm({ ...compiledForm, two: form });
        break;
      }

      case 2:
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
      if (activeStep === 2) {
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
      case 2:
        setCompiledForm({ ...compiledForm, three: form });
        break;
      default:
        return 'not a valid step';
    }
  };
  function getStepContent(step, formContent) {
    switch (step) {
      case 0:
        return <FormLocationForm isView={isView} />;
      case 1:
        return <ToLocationForm isView={isView} />;
      case 2:
        return <OrderInformationForm isView={isView} isEdit={isEdit} />;
      default:
        return 'Unknown step';
    }
  }

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Paper sx={{ p: 1, my: 1, minHeight: 120, bgcolor: 'grey.50012' }}>
            <Typography sx={{ p: 3, my: 3, minHeight: 120 }} style={{ textAlign: 'center' }}>
              {t('order.doneSteps')}
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex' }}>
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
      ) : (
        <>
          <Paper sx={{ p: 1, my: 1, minHeight: 120 }}>
            <Box>{getStepContent(activeStep, compiledForm)}</Box>
          </Paper>
          <Box sx={{ display: 'flex' }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              startIcon={<Icon icon={arrowCircleLeftOutline} />}
            >
              {t('common.btnBack')}
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {activeStep !== steps.length && (
              <Button
                variant="contained"
                onClick={handleNext}
                startIcon={<Icon icon={arrowCircleRightOutline} />}
              >
                {t('common.btnNext')}
              </Button>
            )}
          </Box>
        </>
      )}
    </>
  );
}
