import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Typography, Modal, Grid, Button } from "@material-ui/core/";
import { Close, Delete } from "@material-ui/icons";

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  })
);

export default function ModalAddEmail({
  openDeleteModal,
  onCloseDeleteModal,
  onDeleteSelected
}: any) {
  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={openDeleteModal}
      onClose={onCloseDeleteModal}
    >
      <div style={modalStyle} className={classes.paper}>
        <Typography variant="h6" align="center" style={{ marginBottom: "1em" }}>
          Remove user from user list?
        </Typography>
        <Grid container justify="flex-end" alignItems="flex-end">
          <Grid item>
            <Button
              variant="contained"
              onClick={onCloseDeleteModal}
              style={{ marginRight: "1em" }}
              startIcon={<Close />}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={onDeleteSelected}
              startIcon={<Delete />}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
}
