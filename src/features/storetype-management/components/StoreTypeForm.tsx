import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import LoadingAsyncButton from 'components/LoadingAsyncButton/LoadingAsyncButton';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StoreType } from 'models';

interface Props extends Omit<Partial<DialogProps>, 'title'> {
  title: ReactNode;
  trigger: ReactNode;
  onCancle?: () => void;
  onOk: () => Promise<any>;
  children?: ReactNode;
}

const StoreTypeForm = ({ trigger, onOk: onSubmit, title, children, ...others }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <span
        onClick={() => {
          setOpen(true);
        }}
      >
        {trigger}
      </span>
      <Dialog {...others} fullWidth maxWidth="sm" open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">
            {t('common.cancel')}
          </Button>
          <LoadingAsyncButton
            variant="contained"
            onClick={() => onSubmit().then((res) => setOpen(Boolean(!res)))}
          >
            {t('common.save')}
          </LoadingAsyncButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreTypeForm;
