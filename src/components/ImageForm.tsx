import { UploadFileOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { uploadfile } from 'api/updaloadFileApi';

interface Props {
  value: any;
  title: any;
  onChange: any;
}

const Input = styled('input')({
  display: 'none',
});

const ImageForm = ({ value, onChange, title }: Props) => {
  const [isUploadImage, setUploadImage] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const onUpload = async (e: { target: { files: FileList } }) => {
    setUploadImage(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const listURL = await uploadfile(formData).then((res) => res.data);
    onChange(listURL);
    setUploadImage(false);
    enqueueSnackbar('Upload thành công', {
      variant: 'success',
    });
  };

  return (
    <>
      <Stack direction="column">
        <Typography variant="body1">{title || 'Ảnh bìa'}</Typography>
        <Stack direction="row">
          {value && (
            <Avatar
              variant="square"
              sx={{ top: 8, borderRadius: 1, width: 160, height: 160 }}
              src={value}
            />
          )}
          <label htmlFor="contained-button-file">
            <Input
              onChange={(e: any) => onUpload(e)}
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
            />
            <LoadingButton
              loading={isUploadImage}
              component="span"
              sx={{
                top: 8,
                borderRadius: 1,
                width: 160,
                height: 160,
                borderColor: 'grey.500',
                color: 'grey.500',
                marginLeft: '4px',
              }}
              variant="outlined"
              startIcon={<UploadFileOutlined />}
            >
              Upload
            </LoadingButton>
          </label>
        </Stack>
      </Stack>
    </>
  );
};

export default ImageForm;
