import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';





const columns = [

    { field: 'EventID', headerName: 'EventID', width: 150 },

    // {
    //     field: 'TableName',
    //     headerName: 'TableName',
    //     width: 150,
    //     editable: true,
    // }, {
    //     field: 'Key',
    //     headerName: 'TableKey',
    //     width: 150,
    //     editable: true,
    // },
    // {
    //     field: 'EventName',
    //     headerName: 'EVENT',
    //     width: 150,
    //     editable: true,
    // },
    // {
    //     field: 'EventSourceARN',
    //     headerName: 'EventSourceARN',
    //     width: 150,
    //     editable: true,
    // },
    {
        field: "message",
        headerName: "Message",
        width: 400,
        editable: true,
    }
];
const rows = []


export default function Notification() {
    const [data, setdata] = useState([])
    const fetchDetails = async () => {
        // let userId ='82178782112'
        const res = await axios.get('https://rghx4zhafh.execute-api.us-east-1.amazonaws.com/default/sub')
        console.log("res", res)
        console.log("resData", res.data)
        if(res.data){
            setdata(res.data)
        }
      
    }

    useEffect(() => {
        fetchDetails();
    }, []);
    if (data.length>0) {
        for (const obj of data) {
            obj.Key = JSON.stringify(obj.Key)
            switch (obj.TableName) {
                case "userDetails":

                    if (obj.EventName === "INSERT") obj.message = "Register successully"
                    else if (obj.EventName === "REMOVE") obj.message = "Delete account successfully"
                    else obj.message = "Update account information successfully"

                    break;
                case "Room":
                    if (obj.EventName === "INSERT") obj.message = "Book room successfully"
                    else if (obj.EventName === "REMOVE") obj.message = "Cancel room  successfully"
                    else obj.message = "Modify room information successfully"
                    break;
                case "Kitchen":
                    if (obj.EventName === "INSERT") obj.message = "Order breakfirst successully"
                    else if (obj.EventName === "REMOVE") obj.message = "Cancel order successfully"
                    else obj.message = "Update breakfirst information successfully"

                    break;
                case "Tour":
                    if (obj.EventName === "INSERT") obj.message = "Create tour successfully"
                    else if (obj.EventName === "REMOVE") obj.message = "Delete tour successfully"
                    else obj.message = "Update tour information successfully"

                    break;
                case "Confirm_tour_table":

                    if (obj.EventName === "INSERT") obj.message = "Create tour successfully"
                    else if (obj.EventName === "REMOVE") obj.message = "Delete tour successfully"
                    else obj.message = "Update tour information successfully"

                    break;
            }
        }



    }
    if (data) {
        return (

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={data}
                    getRowId={(row) => row.EventID}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </Box>
        );
    }
    else {
        return (

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </Box>
        );
    }



}
