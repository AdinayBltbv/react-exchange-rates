import {
  CssBaseline,
  Grid,
  Paper,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import theme from "./theme";
import Header from "./Components/Header/Header";
import { useEffect, useState } from "react";
import ExchangesList from "./Components/ExchangesList/ExchangesList";
import axios from "axios";
import Calculate from "./Components/Calculate/Calculate";

const CURRENCIES = ["EUR", "USD", "KGS", "KZT", "RUB"];

const API_WITH_BASE_CURRENCY = (baseCurrency) =>
  `https://v6.exchangerate-api.com/v6/db072028d4cb77861c6a6036/latest/${baseCurrency}`;

function App() {
  const [baseCurrency, setBaseCurrency] = useState("KGS");
  const [allCurrencies, setAllCurrencies] = useState({});

  const handleBaseCurrencyChange = (event) => {
    setBaseCurrency(event.target.value);
  };

  const fetchRates = async (base) => {
    const response = await axios.get(API_WITH_BASE_CURRENCY(base));

    const onlyNeedCurrencies = Object.entries(
      response.data.conversion_rates
    ).reduce((acc, [key, value]) => {
      if (CURRENCIES.includes(key) && base !== key) {
        return {
          ...acc,
          [key]: value,
        };
      } else return acc;
    }, {});

    setAllCurrencies(onlyNeedCurrencies);
  };

  useEffect(() => {
    fetchRates(baseCurrency);
  }, [baseCurrency]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        baseCurrency={baseCurrency}
        onBaseCurrencyChange={handleBaseCurrencyChange}
      />
      <Toolbar />

      <Grid container justifyContent="space-around" sx={{ padding: 7 }}>
        <Grid item xs={12} sm={5} md={5}>
          <Paper
            elevation={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Calculate />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Paper
            elevation={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <ExchangesList currencies={allCurrencies} />
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
