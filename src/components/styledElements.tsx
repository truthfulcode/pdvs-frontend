import { Button, Typography, styled } from '@mui/material'
import React from 'react'

export const PrimaryButton = styled(Button)({
  borderRadius: 8,
  color: "white",
  fontWeight: "bold",
  border: "3px black solid",
  background: "#47a1ffdd",
  '&:hover': {
    backgroundColor: '#47a1ff88',
    boxShadow: 'none',
  },
  // mr: 0.5,
})

export const TimeDisplay = styled(Typography)({
  background: "gray",
  color: "white",
  width: "100px",
  textAlign: "center",
  borderRadius: 4,
})