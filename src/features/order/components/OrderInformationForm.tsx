import plusFill from '@iconify/icons-eva/plus-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import { Icon } from '@iconify/react';
import { Box, Card, CardHeader, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import InputAreaField from 'components/FormField/InputAreaField';
import InputField from 'components/FormField/InputField';
import InputFieldNumberFormat from 'components/FormField/InputFieldNumberFormat';
import { OrderInfo } from 'models';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface OrderInformationFormProps {
  isView: boolean;
  isEdit: boolean;
}

export const OrderInformationForm = ({ isView, isEdit }: OrderInformationFormProps) => {
  const { t } = useTranslation();
  const methods = useFormContext();
  const [listItems, setListItems] = useState<number[]>([0]);

  const { control, setValue, getValues } = methods;
  useEffect(() => {
    if (isView || isEdit) {
      const list = getValues('packageItems');
      const newList = list.map((e, idx) => idx);
      const infoObj = getValues('orderInfo');
      try {
        const obj: OrderInfo = JSON.parse(infoObj);
        setValue('orderInfoObj', obj, {
          shouldDirty: true,
        });
        // eslint-disable-next-line no-empty
      } catch (error) {}

      setListItems(newList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues, isView]);
  const handelAddItem = () => {
    if (isView) return;
    const newList = [...listItems];
    newList.push(newList.length);
    setListItems(newList);
  };
  const handelRemoveItem = (index: number) => {
    if (isView) return;
    const newList = [...listItems];
    newList.splice(index, 1);
    setValue(`packageItems[${index}].code`, '', {
      shouldDirty: true,
    });
    setValue(`packageItems[${index}].quantity`, '', {
      shouldDirty: true,
    });
    setValue(`packageItems[${index}].description`, '', {
      shouldDirty: true,
    });
    setListItems(newList);
  };
  const renderFormItem = (index) => (
    <Box
      key={`box-${index}`}
      style={{
        border: '1px solid',
        borderRadius: '10px',
        borderStyle: 'dashed',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <CardHeader
        style={{ padding: '0px 0px 16px 0px' }}
        action={
          <Tooltip key={`remove-${index}`} title={t('common.remove') || ''}>
            <span>
              <IconButton
                disabled={listItems.length === 1}
                color="error"
                onClick={() => handelRemoveItem(index)}
                size="large"
              >
                <Icon icon={trash2Outline} />
              </IconButton>
            </span>
          </Tooltip>
        }
        title={`${t('order.item')} ${index + 1}`}
      />
      <Stack spacing={2}>
        <InputField
          name={`packageItems[${index}].code`}
          label={`${t('order.codeItem')}*`}
          control={control}
          disabled={isView}
        />
        <InputField
          name={`packageItems[${index}].quantity`}
          label={`${t('order.quantity')}*`}
          type="number"
          control={control}
          disabled={isView}
        />
        <InputField
          name={`packageItems[${index}].description`}
          label={`${t('order.description')}*`}
          control={control}
          disabled={isView}
        />
      </Stack>
    </Box>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom marginBottom={2}>
            {t('order.info')}
          </Typography>
          <Stack spacing={2}>
            <InputField
              name="orderCode"
              label={`${t('order.code')}*`}
              control={control}
              disabled={isView}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2 }}>
              <InputFieldNumberFormat
                name="orderInfoObj.totalPriceOrder"
                label={`${t('order.totalPriceOrder')}*`}
                control={control}
                disabled={isView}
                suffix="vnd"
              />
              <InputFieldNumberFormat
                name="orderInfoObj.cod"
                label={`${t('order.cod')}*`}
                control={control}
                disabled={isView}
                suffix="vnd"
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2 }}>
              <InputField
                name="orderInfoObj.length"
                label={`${t('order.length')}*`}
                control={control}
                type="number"
                disabled={isView}
              />
              <InputField
                name="orderInfoObj.width"
                label={`${t('order.width')}*`}
                control={control}
                type="number"
                disabled={isView}
              />

              <InputField
                name="orderInfoObj.height"
                label={`${t('order.height')}*`}
                control={control}
                type="number"
                disabled={isView}
              />
              <InputField
                name="orderInfoObj.weight"
                label={`${t('order.weight')}*`}
                control={control}
                type="number"
                disabled={isView}
              />
            </Stack>

            <InputField
              name="customerName"
              label={`${t('order.receiverName')}*`}
              control={control}
              disabled={isView}
            />
            <InputField
              name="customerEmail"
              label={`${t('order.email')}*`}
              control={control}
              disabled={isView}
            />
            <InputField
              name="customerPhone"
              label={`${t('order.phone')}*`}
              control={control}
              disabled={isView}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 2 }}>
              <InputFieldNumberFormat
                name="orderInfoObj.serviceCharge"
                label={`${t('order.serviceCharge')}*`}
                control={control}
                disabled={isView}
                suffix="vnd"
              />
              <InputFieldNumberFormat
                name="orderInfoObj.incurred"
                label={`${t('order.incurred')}*`}
                control={control}
                suffix="vnd"
              />
            </Stack>

            <InputAreaField
              name="orderInfoObj.note"
              label={t('order.note')}
              control={control}
              disabled={isView}
            />
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <CardHeader
            style={{ padding: '0px 0px 16px 0px' }}
            action={
              <Tooltip key="add-new-item" title={t('order.addItem') || ''}>
                <IconButton color="success" onClick={handelAddItem} size="large">
                  <Icon icon={plusFill} />
                </IconButton>
              </Tooltip>
            }
            title={t('order.itemList')}
          />
          {listItems.map((e) => renderFormItem(e))}
        </Card>
      </Grid>
    </Grid>
  );
};
