# Shrouded API

## Configuration

See .example.env for configurable parameters.

```sh
npm run dev
```

## Notes

### Application usage pattern

1. Identity group admin creates a new identity group
1. (Offline) Beneficiary communicate identity commitment to identity group admin
1. Identity group admin insert identity commitment(s) into group
1. Beneficiary (whose identity commitment is inserted) fetch entire identity commitment list (mvp, use merkle path to save space)
1. (Offline) Beneficiary generates claim proof
1. Beneficiary submits claim proof
1. Anyone to read the claim ledger
