import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: 'What is the Scholarship Management System?',
      answer: 'The Scholarship Management System is a platform designed to help students find and apply for scholarships, while providing administrators with tools to manage applications efficiently.',
    },
    {
      question: 'How do I apply for a scholarship?',
      answer: 'To apply for a scholarship, you need to create an account, complete your profile, and submit the required documents. You can then browse available scholarships and submit your applications through the platform.',
    },
    {
      question: 'What documents do I need to submit?',
      answer: 'Required documents typically include academic transcripts, proof of income, identification documents, and any specific documents requested by the scholarship provider.',
    },
    {
      question: 'How long does the application process take?',
      answer: 'The application process varies depending on the scholarship. Some applications can be completed in a few minutes, while others may require more time to gather and submit all required documents.',
    },
    {
      question: 'How will I know if my application is approved?',
      answer: 'You will receive notifications through the platform about the status of your application. You can also check the status in your dashboard under the Applications section.',
    },
    {
      question: 'Can I apply for multiple scholarships?',
      answer: 'Yes, you can apply for multiple scholarships as long as you meet the eligibility criteria for each one. Make sure to submit all required documents for each application.',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Box sx={{ mt: 3 }}>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default FAQ; 