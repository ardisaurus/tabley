import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Modal,
  Typography,
  TextField,
  FormControl,
  Button
} from "@material-ui/core/";
import SaveIcon from "@material-ui/icons/Save";

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
      width: 700,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    },
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    formControl: {
      margin: theme.spacing(1.2),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    button: {
      margin: theme.spacing(1.2)
    }
  })
);

export default function ModalAddEvent({ open, onCloseModal, onAddNew }: any) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setValues({
      ...values,
      [event.target.name as string]: event.target.value
    });
  };

  const onSubmitHandler = () => {
    onAddNew({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email
    });
    setValues({ firstName: "", lastName: "", email: "" });
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={onCloseModal}
    >
      <div style={modalStyle} className={classes.paper}>
        <Typography variant="h5">Add Event</Typography>
        <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl}>
            <TextField
              id="outlined-value"
              name="firstName"
              label="First Name"
              variant="outlined"
              margin="dense"
              value={values.firstName}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              id="outlined-value"
              name="lastName"
              label="Last Name"
              variant="outlined"
              margin="dense"
              value={values.lastName}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              id="outlined-value"
              name="email"
              label="Email"
              variant="outlined"
              margin="dense"
              value={values.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl className={classes.button}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                onSubmitHandler();
                onCloseModal();
              }}
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </FormControl>
        </form>
      </div>
    </Modal>
  );
}
