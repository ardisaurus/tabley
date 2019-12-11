import React, { useState } from "react";
import { generate } from "shortid";
import SimpleTable from "./MyTable";
import ModalAdd from "./ModalAdd";

const App = () => {
  const [users, setUsers] = useState([
    {
      id: "12",
      firstName: "bob",
      lastName: "barnes",
      email: "bob@mail.com"
    },
    {
      id: "13",
      firstName: "rebecca",
      lastName: "wilis",
      email: "becca@mail.com"
    },
    {
      id: "14",
      firstName: "tom",
      lastName: "james",
      email: "tom@mail.com"
    }
  ]);

  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const addNew = (newRow: any) => {
    const newUser = {
      id: generate(),
      email: newRow.email,
      firstName: newRow.firstName,
      lastName: newRow.lastName
    };
    setUsers([...users, newUser]);
  };

  const remove = (selected: string) => {
    let arr = users;
    arr = [...arr.filter(myArr => myArr.id !== selected)];
    setUsers(arr);
  };

  const update = (editRow: any) => {
    let arr = users;
    arr = arr.map(myArr => {
      if (myArr.id === editRow.id) {
        myArr = editRow;
      }
      return myArr;
    });
    setUsers(arr);
  };

  return (
    <div>
      <ModalAdd
        open={openModal}
        onCloseModal={() => handleClose()}
        onAddNew={(newRow: {}) => {
          addNew(newRow);
        }}
      />
      <SimpleTable
        myRows={users}
        onDelete={(selected: string) => {
          remove(selected);
        }}
        onUpdate={(editRow: {}) => {
          update(editRow);
        }}
        onOpenModal={() => handleOpen()}
      />
    </div>
  );
};

export default App;
