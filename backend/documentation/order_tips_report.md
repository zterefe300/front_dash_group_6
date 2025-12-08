# Order Tips Report

This report calculates the subtotal, subtotals with service charge (8.25%), tips, and total amount for each order based on the provided formulas.

- subtotal = sum of (item price * quantity) for all items in the order
- subtotals_with_service = subtotal + (0.0825 * subtotal)
- tips = fixed amount if provided, otherwise (percentage * subtotals_with_service)
- total_amount = subtotals_with_service + tips

| order_id | subtotal | subtotals_with_service | tips | total_amount |
|----------|----------|-------------------------|------|--------------|
| FD0001 | 26.97 | 29.20 | 3.00 | 32.20 |
| FD0002 | 59.90 | 64.84 | 5.00 | 69.84 |
| FD0003 | 28.96 | 31.35 | 3.14 | 34.49 |
| FD0004 | 399.70 | 432.51 | 64.88 | 497.39 |
| FD0005 | 50.94 | 55.14 | 5.00 | 60.14 |
| FD0101 | 43.98 | 47.61 | 4.76 | 52.37 |
| FD0102 | 35.98 | 38.96 | 3.90 | 42.86 |
| FD0103 | 87.96 | 95.21 | 14.28 | 109.49 |
| FD0104 | 146.91 | 159.03 | 19.08 | 178.11 |
| FD0201 | 52.90 | 57.26 | 2.00 | 59.26 |
| FD0202 | 369.66 | 400.21 | 100.05 | 500.26 |
| FD0108 | 118.95 | 128.78 | 10.00 | 138.78 |
| FD0043 | 203.83 | 220.65 | 22.00 | 242.65 |
| FD0044 | 71.92 | 77.86 | 3.89 | 81.75 |
| FD0208 | 213.82 | 231.46 | 34.72 | 266.18 |
| FD0209 | 74.88 | 81.03 | 4.05 | 85.08 |
| FD0109 | 155.92 | 168.72 | 30.37 | 199.09 |
| FD0045 | 199.85 | 216.32 | 21.63 | 237.95 |

## Notes
- All amounts are in USD and rounded to 2 decimal places.
- Percentages for tips are extracted from comments in the demo_data.sql file.
- Service charge is fixed at 8.25% as per the ServiceCharge table.
