import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Paper,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ApplicationFormData } from '../../types';

interface FormValues {
  personalDetails: {
    name: string;
    dateOfBirth: string;
    gender: string;
    contact: string;
    address: string;
  };
  academicDetails: {
    institution: string;
    course: string;
    admissionYear: number;
    percentage: string;
  };
}

const validationSchema = Yup.object({
  personalDetails: Yup.object({
    name: Yup.string().required('Name is required'),
    dateOfBirth: Yup.date().required('Date of birth is required'),
    gender: Yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
    contact: Yup.string().required('Contact number is required'),
    address: Yup.string().required('Address is required'),
  }),
  academicDetails: Yup.object({
    institution: Yup.string().required('Institution name is required'),
    course: Yup.string().required('Course name is required'),
    admissionYear: Yup.number()
      .min(2000, 'Invalid year')
      .max(new Date().getFullYear(), 'Invalid year')
      .required('Admission year is required'),
    percentage: Yup.number()
      .min(0, 'Percentage must be between 0 and 100')
      .max(100, 'Percentage must be between 0 and 100')
      .required('Percentage is required'),
  }),
});

interface ApplicationFormProps {
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  isEdit?: boolean;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialValues,
  onSubmit,
  isEdit = false,
}) => {
  const formik = useFormik<FormValues>({
    initialValues: initialValues || {
      personalDetails: {
        name: '',
        dateOfBirth: '',
        gender: '',
        contact: '',
        address: '',
      },
      academicDetails: {
        institution: '',
        course: '',
        admissionYear: new Date().getFullYear(),
        percentage: '',
      },
    },
    validationSchema,
    onSubmit,
  });

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={formik.handleSubmit}>
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Personal Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="personalDetails.name"
                label="Full Name"
                value={formik.values.personalDetails.name}
                onChange={formik.handleChange}
                error={
                  formik.touched.personalDetails?.name &&
                  Boolean(formik.errors.personalDetails?.name)
                }
                helperText={
                  formik.touched.personalDetails?.name &&
                  formik.errors.personalDetails?.name
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="personalDetails.dateOfBirth"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                value={formik.values.personalDetails.dateOfBirth}
                onChange={formik.handleChange}
                error={
                  formik.touched.personalDetails?.dateOfBirth &&
                  Boolean(formik.errors.personalDetails?.dateOfBirth)
                }
                helperText={
                  formik.touched.personalDetails?.dateOfBirth &&
                  formik.errors.personalDetails?.dateOfBirth
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="personalDetails.gender"
                label="Gender"
                value={formik.values.personalDetails.gender}
                onChange={formik.handleChange}
                error={
                  formik.touched.personalDetails?.gender &&
                  Boolean(formik.errors.personalDetails?.gender)
                }
                helperText={
                  formik.touched.personalDetails?.gender &&
                  formik.errors.personalDetails?.gender
                }
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="personalDetails.contact"
                label="Contact Number"
                value={formik.values.personalDetails.contact}
                onChange={formik.handleChange}
                error={
                  formik.touched.personalDetails?.contact &&
                  Boolean(formik.errors.personalDetails?.contact)
                }
                helperText={
                  formik.touched.personalDetails?.contact &&
                  formik.errors.personalDetails?.contact
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="personalDetails.address"
                label="Address"
                value={formik.values.personalDetails.address}
                onChange={formik.handleChange}
                error={
                  formik.touched.personalDetails?.address &&
                  Boolean(formik.errors.personalDetails?.address)
                }
                helperText={
                  formik.touched.personalDetails?.address &&
                  formik.errors.personalDetails?.address
                }
              />
            </Grid>
          </Grid>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Academic Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="academicDetails.institution"
                label="Institution Name"
                value={formik.values.academicDetails.institution}
                onChange={formik.handleChange}
                error={
                  formik.touched.academicDetails?.institution &&
                  Boolean(formik.errors.academicDetails?.institution)
                }
                helperText={
                  formik.touched.academicDetails?.institution &&
                  formik.errors.academicDetails?.institution
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="academicDetails.course"
                label="Course Name"
                value={formik.values.academicDetails.course}
                onChange={formik.handleChange}
                error={
                  formik.touched.academicDetails?.course &&
                  Boolean(formik.errors.academicDetails?.course)
                }
                helperText={
                  formik.touched.academicDetails?.course &&
                  formik.errors.academicDetails?.course
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="academicDetails.admissionYear"
                label="Admission Year"
                value={formik.values.academicDetails.admissionYear}
                onChange={formik.handleChange}
                error={
                  formik.touched.academicDetails?.admissionYear &&
                  Boolean(formik.errors.academicDetails?.admissionYear)
                }
                helperText={
                  formik.touched.academicDetails?.admissionYear &&
                  formik.errors.academicDetails?.admissionYear
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="academicDetails.percentage"
                label="Percentage"
                value={formik.values.academicDetails.percentage}
                onChange={formik.handleChange}
                error={
                  formik.touched.academicDetails?.percentage &&
                  Boolean(formik.errors.academicDetails?.percentage)
                }
                helperText={
                  formik.touched.academicDetails?.percentage &&
                  formik.errors.academicDetails?.percentage
                }
              />
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            {isEdit ? 'Update Application' : 'Submit Application'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}; 