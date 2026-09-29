"""
SeaTrace Maritime Forensics & Environmental Intelligence API Server
Powered by Flask, pandas, openpyxl, and reportlab.
"""

from datetime import datetime, timezone
import io
from flask import Flask, Response, jsonify, send_file
from flask_cors import CORS
import pandas as pd

from generate_reports import (
    generate_csv_report,
    generate_excel_report,
    generate_pdf_report,
    get_drift_forecast_df,
    get_vessel_telemetry_df,
    get_incident_summary_df
)

app = Flask(__name__)
CORS(app)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "SeaTrace Maritime Forensics API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "pandas_version": pd.__version__,
        "capabilities": ["csv_export", "excel_export", "pdf_export", "drift_forecast"]
    })

@app.route("/api/export/csv", methods=["GET"])
def export_csv():
    csv_bytes = generate_csv_report()
    return Response(
        csv_bytes,
        mimetype="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=SeaTrace_ST2046_EvidenceReport.csv",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@app.route("/api/export/excel", methods=["GET"])
def export_excel():
    xlsx_bytes = generate_excel_report()
    return Response(
        xlsx_bytes,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=SeaTrace_ST2046_EvidenceReport.xlsx",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@app.route("/api/export/pdf", methods=["GET"])
def export_pdf():
    pdf_bytes = generate_pdf_report()
    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=SeaTrace_ST2046_EvidenceReport.pdf",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@app.route("/api/drift/forecast", methods=["GET"])
def drift_forecast():
    df = get_drift_forecast_df()
    return jsonify({
        "case_id": "ST-2046",
        "simulation_model": "OpenDrift / NOAA GNOME Lagrangian Ensemble",
        "valid_period_hours": 72,
        "coincident_wind": {"speed_ms": 6.4, "direction_deg": 245, "source": "ECMWF ERA5"},
        "coincident_current": {"speed_ms": 0.42, "direction_deg": 112, "source": "CMEMS Mercator Ocean Physics"},
        "waypoints": df.to_dict(orient="records")
    })

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting SeaTrace Forensics API on port {port} (pandas v{pd.__version__})...")
    app.run(host="0.0.0.0", port=port, debug=False)
