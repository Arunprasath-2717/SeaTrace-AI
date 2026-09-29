"""
SeaTrace Maritime Forensics & Environmental Intelligence
Automated Report Generation Engine using pandas, openpyxl, and reportlab.
Generates certified forensic oil spill attribution reports in CSV, Excel (.xlsx), and PDF formats.
"""

import io
import os
import sys
from datetime import datetime, timezone
import pandas as pd

# ── 1. CORE DATASETS CONSTRUCTED WITH PANDAS ─────────────────────────────

def get_incident_summary_df() -> pd.DataFrame:
    data = {
        "Attribute": [
            "Incident ID",
            "Detection Satellite",
            "Sensor / Mode",
            "Detection Timestamp (UTC)",
            "Coordinates (WGS84)",
            "Maritime Jurisdiction",
            "Estimated Slick Coverage",
            "Hydrocarbon Thickness Class",
            "Prime Suspect Vessel",
            "IMO / MMSI",
            "Attribution Confidence Score",
            "Screening Protocol Status",
            "Coincident ERA5 Wind Speed",
            "Coincident Mercator Current",
            "Legal Framework"
        ],
        "Value": [
            "ST-2046",
            "Sentinel-1A (Copernicus)",
            "C-SAR Interferometric Wide (IW) / VV Polarisation",
            "2026-09-28 06:14:22 UTC",
            "21.4500° N, 68.1000° E",
            "Arabian Sea · India Exclusive Economic Zone (EEZ 200 NM)",
            "48.60 km² (Continuous slick polygon)",
            "Heavy Sheen / True Oil Film (1.0–5.0 µm)",
            "MT OCEAN TITAN",
            "IMO 9876543 / MMSI 525001234",
            "96.4% (Optimal Bayesian Intercept Match)",
            "Stage 03 Validated · Anthropogenic Confirmed",
            "6.4 m/s (245° WSW Moderate Breeze)",
            "0.42 m/s (112° ESE Surface Shear)",
            "IOPC Fund Protocol 4A / UNCLOS Art. 211 / MARPOL Annex I"
        ]
    }
    return pd.DataFrame(data)

def get_vessel_telemetry_df() -> pd.DataFrame:
    vessels = [
        {"MMSI": "525001234", "Vessel_Name": "MT OCEAN TITAN", "IMO": "9876543", "Vessel_Type": "Crude Oil Tanker", "DWT": "158,000", "Flag": "Panama", "Speed_Knots": 0.0, "Heading_Deg": 210, "Lat": 21.45, "Lon": 68.32, "AIS_Status": "DARK_TRANSMISSION_GAP", "Attribution_Score": 96.4, "Action_Required": "Immediate Port-State Detention"},
        {"MMSI": "477001234", "Vessel_Name": "MV ADRIATIC STAR", "IMO": "9234567", "Vessel_Type": "Bulk Carrier", "DWT": "82,000", "Flag": "Liberia", "Speed_Knots": 12.4, "Heading_Deg": 145, "Lat": 19.22, "Lon": 72.11, "AIS_Status": "NOMINAL", "Attribution_Score": 14.2, "Action_Required": "Routine Monitoring"},
        {"MMSI": "566001234", "Vessel_Name": "MT PACIFIC GLORY", "IMO": "9345678", "Vessel_Type": "Chemical Tanker", "DWT": "45,000", "Flag": "Singapore", "Speed_Knots": 14.1, "Heading_Deg": 312, "Lat": 22.10, "Lon": 65.80, "AIS_Status": "NOMINAL", "Attribution_Score": 4.1, "Action_Required": "Cleared Excluded"},
        {"MMSI": "636009871", "Vessel_Name": "LADY ELEANOR", "IMO": "9412345", "Vessel_Type": "Container Ship", "DWT": "110,000", "Flag": "Marshall Is", "Speed_Knots": 17.8, "Heading_Deg": 160, "Lat": 18.55, "Lon": 70.15, "AIS_Status": "NOMINAL", "Attribution_Score": 2.8, "Action_Required": "Cleared Excluded"},
        {"MMSI": "352001992", "Vessel_Name": "ORIENTAL JADE", "IMO": "9554321", "Vessel_Type": "Crude Oil Tanker", "DWT": "298,000", "Flag": "Hong Kong", "Speed_Knots": 13.5, "Heading_Deg": 288, "Lat": 20.80, "Lon": 66.45, "AIS_Status": "NOMINAL", "Attribution_Score": 6.5, "Action_Required": "Routine Monitoring"},
        {"MMSI": "219001444", "Vessel_Name": "NORDIC BREEZE", "IMO": "9612349", "Vessel_Type": "LPG Tanker", "DWT": "54,000", "Flag": "Denmark", "Speed_Knots": 15.2, "Heading_Deg": 45, "Lat": 17.90, "Lon": 71.30, "AIS_Status": "NOMINAL", "Attribution_Score": 1.9, "Action_Required": "Cleared Excluded"},
        {"MMSI": "412005511", "Vessel_Name": "HAI XIN 88", "IMO": "9700112", "Vessel_Type": "General Cargo", "DWT": "32,000", "Flag": "China", "Speed_Knots": 10.8, "Heading_Deg": 190, "Lat": 22.85, "Lon": 67.20, "AIS_Status": "NOMINAL", "Attribution_Score": 3.4, "Action_Required": "Cleared Excluded"},
        {"MMSI": "311002233", "Vessel_Name": "BAHAMAS SPIRIT", "IMO": "9455667", "Vessel_Type": "Product Tanker", "DWT": "49,999", "Flag": "Bahamas", "Speed_Knots": 11.9, "Heading_Deg": 115, "Lat": 19.95, "Lon": 69.40, "AIS_Status": "NOMINAL", "Attribution_Score": 8.7, "Action_Required": "Routine Monitoring"}
    ]
    return pd.DataFrame(vessels)

def get_drift_forecast_df() -> pd.DataFrame:
    forecasts = [
        {"Step": "T+00h", "Valid_Time_UTC": "2026-09-28 06:00", "Lat": 21.45, "Lon": 68.10, "Distance_NM": 0.0, "Slick_Area_km2": 48.6, "Evaporated_Pct": 0.0, "Emulsified_Pct": 0.0, "Dispersion_Pct": 0.0, "Wind_Speed_ms": 6.4, "Current_Speed_ms": 0.42, "Offshore_Dist_NM": 98.4, "Risk_Status": "Baseline Observed"},
        {"Step": "T+12h", "Valid_Time_UTC": "2026-09-28 18:00", "Lat": 21.58, "Lon": 68.35, "Distance_NM": 15.8, "Slick_Area_km2": 56.2, "Evaporated_Pct": 18.2, "Emulsified_Pct": 12.0, "Dispersion_Pct": 2.4, "Wind_Speed_ms": 6.7, "Current_Speed_ms": 0.44, "Offshore_Dist_NM": 84.2, "Risk_Status": "High Open Water"},
        {"Step": "T+24h", "Valid_Time_UTC": "2026-09-29 06:00", "Lat": 21.72, "Lon": 68.62, "Distance_NM": 32.4, "Slick_Area_km2": 68.9, "Evaporated_Pct": 27.5, "Emulsified_Pct": 28.4, "Dispersion_Pct": 5.1, "Wind_Speed_ms": 7.1, "Current_Speed_ms": 0.45, "Offshore_Dist_NM": 69.5, "Risk_Status": "Intermediate Drift"},
        {"Step": "T+48h", "Valid_Time_UTC": "2026-09-30 06:00", "Lat": 21.98, "Lon": 69.15, "Distance_NM": 64.8, "Slick_Area_km2": 89.4, "Evaporated_Pct": 38.0, "Emulsified_Pct": 49.2, "Dispersion_Pct": 9.8, "Wind_Speed_ms": 6.8, "Current_Speed_ms": 0.41, "Offshore_Dist_NM": 42.0, "Risk_Status": "Coastal Proximity Watch"},
        {"Step": "T+72h", "Valid_Time_UTC": "2026-10-01 06:00", "Lat": 22.21, "Lon": 69.65, "Distance_NM": 96.2, "Slick_Area_km2": 114.7, "Evaporated_Pct": 44.2, "Emulsified_Pct": 65.0, "Dispersion_Pct": 14.5, "Wind_Speed_ms": 6.2, "Current_Speed_ms": 0.38, "Offshore_Dist_NM": 18.6, "Risk_Status": "Saurashtra Coast Alert"}
    ]
    return pd.DataFrame(forecasts)

def get_screening_criteria_df() -> pd.DataFrame:
    criteria = [
        {"Criterion": "1. AI Segmentation", "Phenomenon": "Dual-Stage Deep Neural Segmentation", "Finding": "Contiguous 14.8 km² core polygon extracted with sharp boundary", "Evidence": "Backscatter attenuation -7.2 dB relative to ambient water in VV channel", "Status": "VERIFIED"},
        {"Criterion": "2. Image Quality", "Phenomenon": "SAR Swath Radiometric Stability", "Finding": "Zero packet loss; nominal Doppler centroid frequency across swath", "Evidence": "Copernicus ESA SAR Quality Assessment Report (Nominal Stability)", "Status": "VERIFIED"},
        {"Criterion": "3. Look-Alike Screening", "Phenomenon": "Biogenic Surfactant & Solitary Wave Exclusion", "Finding": "Biogenic plankton bloom and internal solitary waves excluded", "Evidence": "Sentinel-3 OLCI optical telemetry confirms chlorophyll-a < 0.11 mg/m³", "Status": "EXCLUDED"},
        {"Criterion": "4. Wind Speed Regime", "Phenomenon": "Low Wind Calm Sea Exclusion (< 3.0 m/s)", "Finding": "Ambient 10m wind speed sustains Bragg capillary resonance", "Evidence": "Coincident ECMWF ERA5 reanalysis measures 6.4 m/s (moderate breeze)", "Status": "EXCLUDED"},
        {"Criterion": "5. Geological Seep", "Phenomenon": "Natural Hydrocarbon Seabed Seep Exclusion", "Finding": "Nearest charted active seabed hydrothermal vent is 26.4 km distant", "Evidence": "GEBCO Bathymetric Survey & Global Seep Database confirms no active vent", "Status": "EXCLUDED"}
    ]
    return pd.DataFrame(criteria)


# ── 2. CSV EXPORT USING PANDAS ───────────────────────────────────────────

def generate_csv_report() -> bytes:
    """Combines all telemetry and evidence dataframes into a structured CSV file."""
    output = io.StringIO()
    
    output.write("================================================================================\n")
    output.write("SEATRACE MARITIME INTELLIGENCE & SATELLITE OIL SPILL FORENSICS\n")
    output.write("CERTIFIED IMO EVIDENCE & 72-HOUR HYDRODYNAMIC DRIFT FORECAST DOSSIER\n")
    output.write(f"Generated at: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')} via pandas v{pd.__version__}\n")
    output.write("================================================================================\n\n")
    
    output.write("# --- SECTION 1: INCIDENT IDENTIFICATION & EVIDENCE SUMMARY ---\n")
    df_inc = get_incident_summary_df()
    df_inc.to_csv(output, index=False)
    output.write("\n")
    
    output.write("# --- SECTION 2: 72-HOUR HYDRODYNAMIC LAGRANGIAN DRIFT FORECAST ---\n")
    df_drift = get_drift_forecast_df()
    df_drift.to_csv(output, index=False)
    output.write("\n")
    
    output.write("# --- SECTION 3: AIS VESSEL SURVEILLANCE & SPATIO-TEMPORAL ATTRIBUTION ---\n")
    df_vessels = get_vessel_telemetry_df()
    df_vessels.to_csv(output, index=False)
    output.write("\n")
    
    output.write("# --- SECTION 4: METOCEAN SCIENTIFIC SCREENING & LOOK-ALIKE DISCRIMINATION ---\n")
    df_criteria = get_screening_criteria_df()
    df_criteria.to_csv(output, index=False)
    output.write("\n")
    
    return output.getvalue().encode('utf-8')


# ── 3. EXCEL WORKBOOK EXPORT USING PANDAS & OPENPYXL ──────────────────────

def generate_excel_report() -> bytes:
    """Generates an executive multi-sheet Excel spreadsheet using pandas.ExcelWriter."""
    output = io.BytesIO()
    
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        # Sheet 1: Incident Summary
        df_inc = get_incident_summary_df()
        df_inc.to_excel(writer, sheet_name='Executive_Summary', index=False)
        
        # Sheet 2: 72-Hour Drift Forecast
        df_drift = get_drift_forecast_df()
        df_drift.to_excel(writer, sheet_name='72h_Drift_Forecast', index=False)
        
        # Sheet 3: AIS Vessel Telemetry
        df_vessels = get_vessel_telemetry_df()
        df_vessels.to_excel(writer, sheet_name='Vessel_Attribution', index=False)
        
        # Sheet 4: Screening Criteria
        df_criteria = get_screening_criteria_df()
        df_criteria.to_excel(writer, sheet_name='Forensic_Exclusion_Matrix', index=False)
        
        # Style sheets with openpyxl
        wb = writer.book
        for sheet in wb.sheetnames:
            ws = wb[sheet]
            ws.views.sheetView[0].showGridLines = True
            for col in ws.columns:
                max_len = max(len(str(cell.value or '')) for cell in col)
                col_letter = col[0].column_letter
                ws.column_dimensions[col_letter].width = max(max_len + 3, 14)
                
    return output.getvalue()


# ── 4. CERTIFIED PDF DOSSIER GENERATION USING REPORTLAB ──────────────────

def generate_pdf_report() -> bytes:
    """Generates a certified legal attribution dossier PDF with tables and stamp."""
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#4f46e5'),
        spaceAfter=12
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    badge_style = ParagraphStyle(
        'BadgeCustom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#059669')
    )

    elements = []

    # 1. Header Block
    elements.append(Paragraph("SEATRACE MARITIME FORENSICS INTELLIGENCE", subtitle_style))
    elements.append(Paragraph("FORENSIC OIL SPILL ATTRIBUTION DOSSIER", title_style))
    elements.append(Paragraph(
        "<b>Case ID:</b> ST-2046 &nbsp;|&nbsp; <b>Satellite:</b> Sentinel-1A C-SAR &nbsp;|&nbsp; <b>Protocol:</b> IOPC Rule 4A &nbsp;|&nbsp; <b>Date:</b> Sep 28, 2026",
        body_style
    ))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#4f46e5'), spaceAfter=10))

    # 2. Key Forensic Findings Box
    kpi_data = [
        [
            Paragraph("<b>Target Spill Area:</b><br/>48.6 km² (Arabian Sea)", body_style),
            Paragraph("<b>Prime Suspect:</b><br/>MT OCEAN TITAN (IMO 9876543)", body_style),
            Paragraph("<b>Confidence Score:</b><br/><b>96.4% OPTIMAL</b>", badge_style),
            Paragraph("<b>Drift Window:</b><br/>72 Hours Forward Forecast", body_style)
        ]
    ]
    kpi_table = Table(kpi_data, colWidths=[135, 155, 120, 130])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(kpi_table)
    elements.append(Spacer(1, 12))

    # 3. Section: 72-Hour Hydrodynamic Drift Forecast
    elements.append(Paragraph("1. 72-Hour Hydrodynamic Lagrangian Drift Forecast (OpenDrift / ERA5)", h2_style))
    df_drift = get_drift_forecast_df()
    drift_table_data = [[
        Paragraph(f"<b>{col}</b>", body_style) for col in ["Step", "Valid Time", "Lat/Lon", "Dist (NM)", "Area (km²)", "Evap %", "Emuls %", "Risk Status"]
    ]]
    for _, row in df_drift.iterrows():
        drift_table_data.append([
            Paragraph(str(row['Step']), body_style),
            Paragraph(str(row['Valid_Time_UTC']), body_style),
            Paragraph(f"{row['Lat']}°N, {row['Lon']}°E", body_style),
            Paragraph(f"{row['Distance_NM']:.1f}", body_style),
            Paragraph(f"{row['Slick_Area_km2']:.1f}", body_style),
            Paragraph(f"{row['Evaporated_Pct']:.1f}%", body_style),
            Paragraph(f"{row['Emulsified_Pct']:.1f}%", body_style),
            Paragraph(str(row['Risk_Status']), body_style)
        ])
    
    drift_table = Table(drift_table_data, colWidths=[45, 90, 85, 55, 60, 50, 50, 105])
    drift_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(drift_table)
    elements.append(Spacer(1, 10))

    # 4. Section: AIS Vessel Telemetry Attribution
    elements.append(Paragraph("2. AIS Vessel Spatio-Temporal Intercept Telemetry", h2_style))
    df_vessels = get_vessel_telemetry_df()
    vessel_table_data = [[
        Paragraph(f"<b>{col}</b>", body_style) for col in ["Vessel Name", "IMO", "Type", "Speed", "Position", "AIS Anomaly", "Attribution"]
    ]]
    for _, row in df_vessels.head(6).iterrows():
        is_target = row['Attribution_Score'] > 90
        vessel_table_data.append([
            Paragraph(f"<b>{row['Vessel_Name']}</b>", body_style),
            Paragraph(str(row['IMO']), body_style),
            Paragraph(str(row['Vessel_Type']), body_style),
            Paragraph(f"{row['Speed_Knots']} kn", body_style),
            Paragraph(f"{row['Lat']}°N, {row['Lon']}°E", body_style),
            Paragraph(str(row['AIS_Status']), body_style),
            Paragraph(f"<b>{row['Attribution_Score']:.1f}%</b>", badge_style if is_target else body_style)
        ])
    
    vessel_table = Table(vessel_table_data, colWidths=[105, 55, 95, 45, 85, 95, 60])
    vessel_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(vessel_table)
    elements.append(Spacer(1, 10))

    # 5. Section: Metocean Look-Alike Screening Matrix
    elements.append(Paragraph("3. Scientific False-Positive & Look-Alike Screening (Stage 03 Protocol)", h2_style))
    df_crit = get_screening_criteria_df()
    crit_table_data = [[
        Paragraph(f"<b>{col}</b>", body_style) for col in ["Exclusion Criterion", "Scientific Finding", "Status"]
    ]]
    for _, row in df_crit.iterrows():
        crit_table_data.append([
            Paragraph(f"<b>{row['Criterion']}</b>", body_style),
            Paragraph(f"{row['Finding']}. <i>{row['Evidence']}</i>", body_style),
            Paragraph(f"<b>{row['Status']}</b>", badge_style)
        ])
    crit_table = Table(crit_table_data, colWidths=[120, 360, 60])
    crit_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(crit_table)
    elements.append(Spacer(1, 12))

    # 6. Certification & IOPC Stamp Block
    cert_data = [
        [
            Paragraph(
                "<b>FORENSIC CERTIFICATION:</b><br/>"
                "This intelligence dossier has been compiled in accordance with IOPC Fund Protocol 4A for admissibility before maritime tribunals. "
                "Coincident radar backscatter damping, OpenDrift trajectories, and AIS dark anomaly records demonstrate direct physical causality.<br/>"
                "<i>Duty Hydrodynamic Forensics Officer &nbsp;|&nbsp; Indian Coast Guard Maritime Operations Centre</i>",
                body_style
            ),
            Paragraph(
                "<font color='#059669'><b>[VERIFIED]</b></font><br/>"
                "<b>IOPC COMPLIANT</b><br/>"
                "UNCLOS Art. 211<br/>"
                "Checksum: 0x9F4C2A",
                badge_style
            )
        ]
    ]
    cert_table = Table(cert_data, colWidths=[420, 120])
    cert_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#86efac')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(cert_table)

    doc.build(elements)
    return buffer.getvalue()


# ── 5. CLI INTERFACE ─────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SeaTrace pandas & reportlab report generator")
    parser.add_argument("--format", choices=["csv", "excel", "pdf", "all"], default="all")
    parser.add_argument("--outdir", default="./scratch")
    args = parser.parse_args()

    os.makedirs(args.outdir, exist_ok=True)

    if args.format in ["csv", "all"]:
        csv_bytes = generate_csv_report()
        p = os.path.join(args.outdir, "SeaTrace_ST2046_EvidenceReport.csv")
        with open(p, "wb") as f:
            f.write(csv_bytes)
        print(f"Generated CSV: {p} ({len(csv_bytes)} bytes)")

    if args.format in ["excel", "all"]:
        xlsx_bytes = generate_excel_report()
        p = os.path.join(args.outdir, "SeaTrace_ST2046_EvidenceReport.xlsx")
        with open(p, "wb") as f:
            f.write(xlsx_bytes)
        print(f"Generated Excel: {p} ({len(xlsx_bytes)} bytes)")

    if args.format in ["pdf", "all"]:
        pdf_bytes = generate_pdf_report()
        p = os.path.join(args.outdir, "SeaTrace_ST2046_EvidenceReport.pdf")
        with open(p, "wb") as f:
            f.write(pdf_bytes)
        print(f"Generated PDF: {p} ({len(pdf_bytes)} bytes)")
