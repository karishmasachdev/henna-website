import os
from flask import Flask, request, jsonify, render_template
import pymysql

app = Flask(__name__)

# ==============================
# DATABASE CONNECTION (AIVEN)
# ==============================
connection = pymysql.connect(
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
    db="defaultdb",  # we'll create/use henna_booking table
    host="henna-booking-db-hennabyhanisha.f.aivencloud.com",
    user="avnadmin",
    password="AVNS_-eGf6JbAGHIFePfwkte",
    port=28479,
    connect_timeout=10,
    read_timeout=10,
    write_timeout=10,
)

cursor = connection.cursor()

# ==============================
# ROUTES
# ==============================
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/booking")
def booking_page():
    return render_template("booking.html")

@app.route("/book", methods=["POST"])
def book():
    data = request.get_json()
    print("Received:", data)

    name = data.get("name")
    location = data.get("location")
    date = data.get("date")
    time = data.get("time")

    if not all([name, location, date, time]):
        return jsonify({"status":"error","message":"Missing fields!"}), 400

    try:
        sql = "INSERT INTO henna (name, location, date, time) VALUES (%s,%s,%s,%s)"
        cursor.execute(sql, (name, location, date, time))
        connection.commit()
        print("Inserted into database")
        return jsonify({"status":"success","message":"Appointment booked successfully!"}), 200
    except Exception as e:
        print("DB error:", e)
        return jsonify({"status":"error","message": str(e)}), 500

# ==============================
# RUN APP
# ==============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render will assign this automatically
    app.run(debug=True, host="0.0.0.0", port=port)
