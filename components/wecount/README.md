# Historical #WeCount explorer

Monthly estimates are transcribed from Table 1, pages 10–11, of the Society of Family Planning’s report released October 24, 2023:
https://societyfp.org/wp-content/uploads/2023/10/WeCountReport_10.16.23.pdf

The interface covers April 2022 through June 2023 and compares each selected month with April 2022, following the original campaign’s navigation. The source report’s pre/post summaries instead use the average of April and May 2022. The interface states this difference and does not reuse the screenshots’ example totals or policy groupings.

Suppressed `<10` cells remain intervals of 0–9. They are displayed as `<10`, with a range for the change and percentage. The trend breaks its line at suppressed values and uses hollow marks; it does not imply exact zeros. National estimates use the published national row, rather than adding independently rounded state estimates.

Map boundaries are projected from the PublicaMundi Mapping API’s published state geometries:
https://github.com/PublicaMundi/MappingAPI/blob/master/data/geojson/us-states.json

The local geometry contains 48 contiguous states and Washington, DC. Alaska and Hawaii use explicitly labeled inset markers. All 50 states and DC are available from the accessible state selector. Glow radii use the same scale across every month; each glow represents a state total, not a clinic location.
