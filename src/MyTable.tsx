import React from "react";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme
} from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Button,
  Tooltip,
  TextField,
  Grid
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import ModalDelete from "./ModalDelete";

interface Data {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

function createData(
  id: string,
  firstName: string,
  lastName: string,
  email: string
): Data {
  return { id, firstName, lastName, email };
}

type Rows = Array<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}>;

const setBrows = (myRows: any) => {
  let brows: Rows = [];
  for (let i = 0; i < myRows.length; i++) {
    brows = [
      ...brows,
      createData(
        myRows[i].id,
        myRows[i].firstName,
        myRows[i].lastName,
        myRows[i].email
      )
    ];
  }
  return brows;
};

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort<T>(array: T[], cmp: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

type Order = "asc" | "desc";

function getSorting<K extends keyof any>(
  order: Order,
  orderBy: K
): (
  a: { [key in K]: number | string },
  b: { [key in K]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: "id", numeric: false, disablePadding: false, label: "id" },
  {
    id: "firstName",
    numeric: false,
    disablePadding: false,
    label: "firstName"
  },
  { id: "lastName", numeric: false, disablePadding: false, label: "lastName" },
  { id: "email", numeric: false, disablePadding: false, label: "email" }
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: "1 1 100%"
    }
  })
);

interface EnhancedTableToolbarProps {
  onOpenClick: (event: React.MouseEvent<unknown>) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { onOpenClick } = props;
  const openHandler = () => (event: React.MouseEvent<unknown>) => {
    onOpenClick(event);
  };

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle">
        Users
      </Typography>
      <Tooltip title="Filter list">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openHandler()}
        >
          Add
        </Button>
      </Tooltip>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      marginTop: theme.spacing(3)
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    tableWrapper: {
      overflowX: "auto"
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1
    }
  })
);

export default function MyTable({
  myRows,
  onDelete,
  onUpdate,
  onOpenModal
}: any) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("id");
  const [selectedId, setSelectedId] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState<Rows>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editRow, setEditRow] = React.useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

  React.useEffect(() => {
    setRows(setBrows(myRows));
  }, [myRows]);

  const editFormFill = (selId: string) => {
    const selectedRowIndex = rows.findIndex(x => x.id === selId);
    setEditRow({
      firstName: rows[selectedRowIndex].firstName,
      lastName: rows[selectedRowIndex].lastName,
      email: rows[selectedRowIndex].email
    });
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleOpen = () => {
    onOpenModal();
  };

  const handleDelete = () => {
    onDelete(selectedId);
    setOpenDeleteModal(false);
    setSelectedId("");
  };

  const handleOpenDeleteModal = (id: any) => {
    setOpenDeleteModal(true);
    setSelectedId(id);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedId("");
  };

  const handleUpdate = () => {
    onUpdate({ ...editRow, id: selectedId });
    setSelectedId("");
  };

  const handleEditClick = (id: any) => {
    setSelectedId(id);
    editFormFill(id);
  };

  const handleCancelEditClick = () => {
    setSelectedId("");
    setEditRow({
      firstName: "",
      lastName: "",
      email: ""
    });
  };

  const valueChangeHandler = (e: any) => {
    setEditRow({ ...editRow, [e.target.name]: e.target.value });
  };

  return (
    <div className={classes.root}>
      <ModalDelete
        openDeleteModal={openDeleteModal}
        onCloseDeleteModal={() => {
          handleCloseDeleteModal();
        }}
        onDeleteSelected={handleDelete}
      />
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          onOpenClick={() => {
            handleOpen();
          }}
        />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>
                        {row.id === selectedId ? (
                          <TextField
                            id="outlined-basic"
                            name="firstName"
                            margin="dense"
                            variant="outlined"
                            value={editRow.firstName}
                            onChange={valueChangeHandler}
                            fullWidth
                          />
                        ) : (
                          row.firstName
                        )}
                      </TableCell>
                      <TableCell>
                        {row.id === selectedId ? (
                          <TextField
                            id="outlined-basic"
                            name="lastName"
                            margin="dense"
                            variant="outlined"
                            value={editRow.lastName}
                            onChange={valueChangeHandler}
                            fullWidth
                          />
                        ) : (
                          row.lastName
                        )}
                      </TableCell>
                      <TableCell>
                        {row.id === selectedId ? (
                          <TextField
                            id="outlined-basic"
                            name="email"
                            margin="dense"
                            variant="outlined"
                            value={editRow.email}
                            onChange={valueChangeHandler}
                            fullWidth
                          />
                        ) : (
                          row.email
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                        style={{ padding: "1em", minWidth: "200" }}
                      >
                        {row.id === selectedId ? (
                          <Grid
                            container
                            justify="flex-end"
                            alignItems="flex-end"
                          >
                            <Grid item>
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                startIcon={<CloseIcon />}
                                onClick={() => {
                                  handleCancelEditClick();
                                }}
                                style={{ marginRight: "1em" }}
                              >
                                Cancel
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<SaveIcon />}
                                onClick={() => {
                                  handleUpdate();
                                }}
                              >
                                Save
                              </Button>
                            </Grid>
                          </Grid>
                        ) : (
                          <div>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                handleEditClick(row.id);
                              }}
                              style={{ marginRight: "1em" }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="secondary"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                handleOpenDeleteModal(row.id);
                              }}
                              style={{ marginRight: "1em" }}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "previous page"
          }}
          nextIconButtonProps={{
            "aria-label": "next page"
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
