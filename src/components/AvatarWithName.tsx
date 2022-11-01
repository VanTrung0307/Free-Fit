import { Avatar, Box, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as React from 'react';
import { splitLongString } from 'utils/common';

interface TypographyDetailsProps {
  img?: string;
  name?: string;
  id?: number;
}
const useStyle = makeStyles((theme) => ({
  boxFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'row',
  },
}));

export default function AvatarWithName({ id, img, name }: TypographyDetailsProps) {
  const classes = useStyle();
  return (
    <Grid item xs={6} md={6} lg={6} key={`grid-agent-${id || ''}`}>
      <Box className={classes.boxFlex}>
        <Avatar alt="error" src={img} key={`avatar-agent-${id || ''}`} />
        <Typography variant="subtitle2" noWrap>
          {splitLongString(name || 'no data', 10)}
        </Typography>
      </Box>
    </Grid>
  );
}
