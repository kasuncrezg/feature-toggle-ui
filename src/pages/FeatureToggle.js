import React ,   { useState, useEffect , forwardRef } from "react";


import MaterialTable from "material-table";
import axios from "axios"; 

import { Alert, Grid   } from "@mui/material";
import { AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn } from "@mui/icons-material";
import {BASE_URL} from '../config';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const api = axios.create({
  baseURL: BASE_URL
});

 

function FeatureToggle() {
  const columns = [
    { title: "id", field: "id", hidden: true },
    { title: "Display Name", field: "displayName" },
    { title: "Technical Name", field: "technicalName" },
    { title: "Inverted", field: "inverted" ,type : 'boolean' },
        { title: "Expires On", field: "expiresOn"  },
    
    { title: "Description", field: "description" }
   
  ];
  const [data, setData] = useState([]); // table data

  // for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    api
      .get("/api/featuretoggle")
      .then(res => {
        setData(res.data.payload);
      })
      .catch(error => {
        console.log("Error");
      });
  }, []); 

  const handleRowUpdate = (newData, oldData, resolve) => {
    // validation
    const errorList = [];
    console.log(newData); 
    // if (newData.name === "") {
    //   errorList.push("Please enter name");
   // }
    
    
    // if (errorList.length < 1) {
      api
        .patch(`/api/featuretoggle/${newData.id}`  , newData)
        .then(res => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          resolve();
          setIserror(false);
          setErrorMessages([]);
        })
        .catch(error => {
          setErrorMessages(["Update failed! Server error"]);
          setIserror(true);
          resolve();
        });
   /* } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    } */ 
  };

  const handleRowAdd = (newData, resolve) => {
    // validation
    const errorList = [];
    if (newData.name === undefined) {
      errorList.push("Please enter name");
    }
     
     
   // if (errorList.length < 1) {
      // no error
      api
        .post("/api/featuretoggle", newData)
        .then(res => {
          const dataToAdd = [...data];
          dataToAdd.push(newData);
          setData(dataToAdd);
          resolve();
          setErrorMessages([]);
          setIserror(false);
        })
        .catch(error => {
          setErrorMessages(["Cannot add data. Server error!"]);
          setIserror(true);
          resolve();
        });
  /*  } else {
      setErrorMessages(errorList);
      setIserror(true);
       resolve();
    } */
  };

  const handleRowDelete = (oldData, resolve) => {
    api
      .delete(`/api/featuretoggle/${oldData.id}`)
      .then(res => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"]);
        setIserror(true);
        resolve();
      });
  };

  return (
    <div className="App">
      <Grid container spacing={1}>
      
           
        <Grid item xs={12}>
          <div>
            {iserror && (
              <Alert severity="error">
                {errorMessages.map((msg, i) => {
                  return <div key={i}>{msg}</div>;
                })}
              </Alert>
            )}
          </div> 
          <h2> FeatureToggle Management</h2>
          <MaterialTable
            title=""
            columns={columns}
            data={data}
            icons={tableIcons}
             options={{
    rowStyle: {
      fontSize: 12,
    }
  }}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise(resolve => {
                  handleRowUpdate(newData, oldData, resolve);
                }),
              onRowAdd: newData =>
                new Promise(resolve => {
                  handleRowAdd(newData, resolve);
                }),
              onRowDelete: oldData =>
                new Promise(resolve => {
                  handleRowDelete(oldData, resolve);
                })
            }}
          />
        </Grid>
           
      </Grid>
    </div>
  );
}

export default FeatureToggle;
