def generate_ics(events: list) -> str:
    """Generates an .ics file content natively from a list of events without relying on the 'ics' library."""
    lines = []
    lines.append("BEGIN:VCALENDAR")
    lines.append("VERSION:2.0")
    lines.append("PRODID:-//Course Date Extractor//EN")

    for item in events:
        event_name = item.get("event", "Academic Event")
        category = item.get("category", "N/A")
        date_str = item.get("date")
        
        # Only add valid dates to the ics (very basic check for YYYY-MM-DD layout)
        if date_str and len(date_str) > 7 and "-" in date_str:
            lines.append("BEGIN:VEVENT")
            lines.append(f"SUMMARY:{event_name}")
            lines.append(f"DESCRIPTION:Category: {category}")
            # Format date as YYYYMMDD
            formatted_date = date_str.replace("-", "")
            lines.append(f"DTSTART;VALUE=DATE:{formatted_date}")
            lines.append("END:VEVENT")

    lines.append("END:VCALENDAR")
    return "\\r\\n".join(lines) + "\\r\\n"
