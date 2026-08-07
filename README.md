[README (6).md](https://github.com/user-attachments/files/30810787/README.6.md)
# Henna by Hanisha — Business Website

A website for my henna business, built with Flask. Live at [hennabyhanisha.com](https://hennabyhanisha.com).

## What it does

- Showcases a gallery of past henna work
- Displays service info and pricing
- Lets visitors book an appointment through a booking form — submissions are emailed directly to me with all the appointment details

## Tech stack

- **Backend:** Python, Flask
- **Frontend:** HTML/CSS templates (Jinja2), static assets served via Flask
- **Database:** SQL (used during local development for storing bookings)
- **Deployment:** Netlify

## Architecture note

Locally, the app stores bookings in a SQL database. Netlify's environment doesn't support a persistent server-side database the way a traditional host would, so for the deployed version, booking submissions are sent via email instead of being written to a database — keeping the booking flow fully functional in production without needing a hosted database.

## Project structure

```
├── app.py              Flask app and routes
├── templates/           HTML pages (Jinja2 templates)
├── static/              CSS, images, and other static assets
└── requirements.txt      Python dependencies
```

## Running locally

```bash
pip install -r requirements.txt
python app.py
```

## Notes

This started as a way to give my henna business an actual online presence beyond social media — a place clients can see my work, check pricing, and book directly without back-and-forth messaging.
