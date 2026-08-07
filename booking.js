document.addEventListener("DOMContentLoaded", () => {
  const locationSelect = document.getElementById("location");
  const dateSelect = document.getElementById("date-section");
  const timeSelect = document.getElementById("time-section");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const design = document.getElementById("design").value;

  // Set min date to today
  const today = new Date();
  dateInput.min = today.toISOString().split("T")[0];

  const norcalRanges = [
    { start: "2026-05-21", end: "2026-06-10" },
    { start: "2026-07-01", end: "2026-08-15" },
    { start: "2026-11-21", end: "2026-11-28" },
    { start: "2026-11-21", end: "2026-11-30" },
    { start: "2026-12-18", end: "2027-01-20" },
    { start: "2026-03-27", end: "2026-04-03" }
  ];

  function expandDates(ranges) {
    let dates = [];
    ranges.forEach(r => {
      let current = new Date(r.start);
      const end = new Date(r.end);
      while (current <= end) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  }

  const specialDates = expandDates(norcalRanges);

  // Show date section after selecting location
  locationSelect.addEventListener("change", () => {
    if (locationSelect.value === "norcal" || locationSelect.value === "socal") {
      dateSelect.classList.remove("hidden");

      if (dateInput._flatpickr) dateInput._flatpickr.destroy();

      if (locationSelect.value === "norcal") {
        flatpickr("#date", { dateFormat: "Y-m-d", minDate: "today", enable: specialDates });
      } else {
        flatpickr("#date", { dateFormat: "Y-m-d", minDate: "today", disable: specialDates });
      }
    }
  });
  
  // Show time section after picking date
  dateInput.addEventListener("change", () => {
    timeSelect.classList.remove("hidden");
    const selectedDate = dateInput.value;
    populateTimes(selectedDate);
  });

  function populateTimes(date) {
    const day = new Date(date).getDay();
    let times = [];

    if (locationSelect.value === "norcal") {
      times = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"];
    } else {
      switch(day) {
        case 0: case 6: times = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"]; break;
        case 1: case 3: times = ["9:00 AM","10:00 AM","11:00 AM","6:00 PM","7:00 PM","8:00 PM"]; break;
        case 2: case 4: times = ["12:00 PM","1:00 PM"]; break;
        case 5: times = ["2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"]; break;
      }
    }

    timeInput.innerHTML = '<option value="">-- Select a time --</option>';
    times.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      timeInput.appendChild(opt);
    });
  }

  // --- UPGRADED BACKGROUND SUBMISSION (Replaced mailto popup) ---

  document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const people = document.getElementById("people").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("people", people);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("design", design);
    

    fetch("/.netlify/functions/book", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
    })
    .then(async (res) => {
        const text = await res.text();
        let data = {};
        
        // Safely try to read JSON, otherwise fallback to plain text response
        try {
            data = JSON.parse(text);
        } catch(e) {
            data = { error: text };
        }
        
        if (!res.ok) {
            // If it's an HTML page error, give a clean human-readable alert
            if (text.includes("<!DOCTYPE") || res.status === 404) {
                throw new Error("Netlify cannot find your backend function. Check that your folder is named 'netlify/functions' in all lowercase letters!");
            }
            throw new Error(data.error || "Server Error");
        }
        return data;
    })
    .then(data => {
        alert("Success! Your henna booking application has been sent.");
        document.getElementById("bookingForm").reset();
        dateSelect.classList.add("hidden");
        timeSelect.classList.add("hidden");
    })
    .catch(err => {
        alert("Failed to send booking: " + err.message);
        console.error("Submission error:", err);
    });
  });
});