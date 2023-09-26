import React, { useState, useCallback } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  inputGroup: {
    marginBottom: theme.spacing(2),
  },
  select: {
    maxWidth: "6rem",
  },
}));

const Calculate = () => {
  const classes = useStyles();

  const [firstAmount, setFirstAmount] = useState("");
  const [secondAmount, setSecondAmount] = useState("");
  const [firstCurrency, setFirstCurrency] = useState("USD");
  const [secondCurrency, setSecondCurrency] = useState("KGS");

  const API_CALCULATE = (from, to, amount) =>
    `https://v6.exchangerate-api.com/v6/db072028d4cb77861c6a6036/pair/${from}/${to}/${amount}`;

  const calculate = useCallback(
    async (type) => {
      try {
        const fromCurrency = encodeURIComponent(
          type === "first" ? firstCurrency : secondCurrency
        );
        const toCurrency = encodeURIComponent(
          type === "first" ? secondCurrency : firstCurrency
        );
        const amount = encodeURIComponent(
          type === "first" ? firstAmount : secondAmount
        );

        const response = await fetch(
          API_CALCULATE(fromCurrency, toCurrency, amount)
        );

        if (!response.ok) {
          throw new Error("Error");
        }

        const data = await response.json();

        if (data.result === "success") {
          if (type === "first") {
            setSecondAmount(data.conversion_result);
          } else {
            setFirstAmount(data.conversion_result);
          }
        } else {
          console.error("Не удалось рассчитать обмен.");
        }
      } catch (error) {
        console.error("Ошибка при расчете обмена:", error);
      }
    },
    [firstAmount, firstCurrency, secondAmount, secondCurrency]
  );

  const handleFirstAmountChange = (e) => {
    setFirstAmount(e.target.value);
    calculate("first");
  };

  const handleSecondAmountChange = (e) => {
    setSecondAmount(e.target.value);
    calculate("second");
  };

  const handleFirstCurrencyChange = (e) => {
    setFirstCurrency(e.target.value);
    calculate("first");
  };

  const handleSecondCurrencyChange = (e) => {
    setSecondCurrency(e.target.value);
    calculate("second");
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4">Калькулятор</Typography>
      <Grid container spacing={2} className={classes.inputGroup}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="firstAmount"
            type="number"
            label="Sum"
            value={firstAmount}
            onChange={handleFirstAmountChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            id="firstCurrency"
            value={firstCurrency}
            onChange={handleFirstCurrencyChange}
            className={classes.select}
          >
            <MenuItem value="KGS">KGS</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="KZT">KZT</MenuItem>
            <MenuItem value="RUB">RUB</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={2} className={classes.inputGroup}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="secondAmount"
            type="number"
            label="Sum"
            value={secondAmount}
            onChange={handleSecondAmountChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select
            id="secondCurrency"
            value={secondCurrency}
            onChange={handleSecondCurrencyChange}
            className={classes.select}
          >
            <MenuItem value="KGS">KGS</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="KZT">KZT</MenuItem>
            <MenuItem value="RUB">RUB</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Calculate;
