import React, { useState, useEffect, forwardRef } from "react";

import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Checkbox, FormControlLabel, Button } from '@mui/material';
import axios from "axios";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


import { BASE_URL } from '../config';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections

import {
	AppTasks,
	AppNewsUpdate,
	AppOrderTimeline,
	AppCurrentVisits,
	AppWebsiteVisits,
	AppTrafficBySite,
	AppWidgetSummary,
	AppCurrentSubject,
	AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------
const api = axios.create({
	baseURL: BASE_URL
});


export default function DashboardApp() {
	const theme = useTheme();
	const [customers, setCustomers] = useState([]); // table data
	const [featureToggles, setFeatureToggle] = useState([]); // table data
	const [selectedToggles, setSelectedToggles] = useState([]); // table data
	const [selectedcustomer, setSelectedcustomer] = useState([]); // table data
	const [fetures, setFetures] = useState([]); // table data
	const fetchFetures = ()=>{
		
		if (selectedcustomer) {
						api
							.post("/api/features", { customerId: selectedcustomer.id, features: selectedToggles.map(e => e.technicalName) })
							.then(res => {
								setFetures(res.data);
							})
							.catch(error => {
								console.log("Error");
							});
					}
		
	}
	useEffect(() => {
		api
			.get("/api/customer")
			.then(res => {
				setCustomers(res.data);
			})
			.catch(error => {
				console.log("Error");
			});


		api
			.get("/api/featuretoggle")
			.then(res => {
				setFeatureToggle(res.data.payload);
			})
			.catch(error => {
				console.log("Error");
			});
	}, []);
	return (
		<Page title="Dashboard">
			<Container maxWidth="xl">
				<Typography variant="h4" sx={{ mb: 5 }}>
					Hi, Welcome back
				</Typography>

				<Grid container spacing={3}>

					<Grid item xs={4} md={4} lg={4}>
						<Grid container spacing={3}>

							<Grid item xs={12} md={12} lg={12}>
								<Autocomplete
									disablePortal
									id="combo-box-demo"
									onChange={(event, newValue) => {
										setSelectedcustomer(newValue);
									}}
									options={customers.map(c => { return { label: c.name, id: c.id }; })}
									sx={{ width: 300 }}
									renderInput={(params) => <TextField {...params} label="Customer" />}
								/>
							</Grid>
							<Grid item xs={12} md={12} lg={12}>
								<Button variant="contained"
									onClick={(e) => {
										fetchFetures();

									}}

								>Find Feture Toggles</Button>

							</Grid>
							<Grid item xs={12} md={12} lg={12}>
								<Grid container>
									{featureToggles && featureToggles.map((ft) => <>
										<Grid item xs={12} md={12} lg={12}>
											<FormControlLabel
												label={ft.displayName}
												control={
													<Checkbox
														onChange={(e) => {

															if (!e.target.checked) {
																setSelectedToggles(selectedToggles.filter(f => f.id !== ft.id));
															} else {
																setSelectedToggles([...selectedToggles, ft]);
															}
															console.log(ft);
														}}
													/>
												}
											/>
										</Grid>
									</>)}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={8} md={8} lg={8}>
							Selected Fetures
							<Grid container  >
								<Grid item  md={12}  > <Grid container spacing={3}> <Grid item  md={2}  >
											Name  
										</Grid>
										<Grid item  md={2}  >
											Tech Name 
										</Grid>
										<Grid item  md={2}  >
											inverted  
										</Grid>
										<Grid item  md={2}  >
											expired  
										</Grid>
										<Grid item  md={2}  >
											Customer Attached  
										</Grid>
										<Grid item  md={2}  >
											Action  
										</Grid>
										</Grid>
										</Grid>
								{fetures && fetures.map(f=><>
									<Grid item  md={12}  >
										
										<Grid container spacing={3} >
										
										<Grid item  md={2}  >
										  {f.name}
										</Grid>
										<Grid item  md={2}  >
											 {f.technicalName}
										</Grid>
										<Grid item  md={2}  >
											  {f.inverted?'YES':'NO'}
										</Grid>
										<Grid item  md={2}  >
											  {f.expired?'YES':'NO'}
										</Grid>
										<Grid item  md={2}  >
											  {f.customerFound?'YES':'NO'}
										</Grid>
										<Grid item  md={2}  >
											  {f.customerFound?<>
											  
											  <Button variant="contained" color="error"
											  
											  onClick={(e) => {
										if (selectedcustomer) {
											api
												.post("/api/customer/detach", { customerId: selectedcustomer.id, featureId: f.id})
												.then(res => {
														fetchFetures();
												})
												.catch(error => {
													console.log("Error");
												});
										}

									}}
									
											   >De Attach </Button>
											  </>:<>
											  	<Button variant="contained" color="success"
											  	
											  	onClick={(e) => {
										if (selectedcustomer) {
											api
												.post("/api/customer/attach", { customerId: selectedcustomer.id, featureId: f.id})
												.then(res => {
														fetchFetures();
												})
												.catch(error => {
													console.log("Error");
												});
										}

									}}
											  	
											  	 >Attach</Button>
											  </>}
										</Grid>
										</Grid>
									</Grid>
								</>)}
							
							</Grid>
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
}
