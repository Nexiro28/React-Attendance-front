import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
const [attendance, setAttendance] = useState([]);
const [summary, setSummary] = useState({});
const [subjects, setSubjects] = useState([]);
const [newSubject, setNewSubject] = useState("");
const [timeLeft, setTimeLeft] = useState(15 * 60);
const [percentage, setPercentage] = useState([]);

// ================= LOGOUT =================
const logout = () => {
localStorage.removeItem("token");
window.location.href = "/";
};

// ================= FETCH PERCENTAGE =================
const fetchPercentage = async () => {
try {
const res = await API.get("subjects/percentage/");
setPercentage(res.data);
} catch (err) {
console.log(err.response);
}
};

// ================= ADD SUBJECT =================
const addSubject = async () => {
if (!newSubject.trim()) return;


try {
  await API.post("subjects/add/", {
    subject: newSubject,
  });

  setSubjects([...subjects, newSubject]);
  setNewSubject("");
  fetchPercentage(); // refresh %
} catch (err) {
  alert(err.response?.data?.error || "Error adding subject");
}


};

// ================= DELETE SUBJECT =================
const deleteSubject = async (subject) => {
const confirmDelete = window.confirm(`Delete ${subject}?`);
if (!confirmDelete) return;


try {
  await API.delete("subjects/delete/", {
    data: { subject },
  });

  setSubjects(subjects.filter((s) => s !== subject));
  fetchPercentage();
} catch (err) {
  alert("Error deleting subject");
}


};

// ================= MARK ATTENDANCE =================
const markAttendance = async (status, subject) => {
try {
const res = await API.post("attendance/", {
status,
subject,
});


  alert(res.data.message);
  fetchData();
  fetchPercentage();
} catch (err) {
  console.log(err.response);
  alert("Error marking attendance");
}

};

// ================= CLEAR DATA =================
const clearAllData = async () => {
const confirmDelete = window.confirm("Delete ALL attendance data?");
if (!confirmDelete) return;


try {
  const res = await API.delete("attendance/clear/");
  alert(res.data.message);
  fetchData();
  fetchPercentage();
} catch (err) {
  alert("Error clearing data");
}


};

// ================= FETCH =================
const fetchData = async () => {
try {
const listRes = await API.get("attendance/list/");
const summaryRes = await API.get("attendance/summary/");


  setAttendance(listRes.data);
  setSummary(summaryRes.data);
} catch (err) {
  console.log(err.response);
  alert("Error fetching data");
}


};

const fetchSubjects = async () => {
try {
const res = await API.get("subjects/");
setSubjects(res.data);
} catch (err) {
console.log(err);
}
};

// ================= LOAD =================
useEffect(() => {
const token = localStorage.getItem("token");


if (!token) {
  window.location.href = "/";
  return;
}

fetchData();
fetchSubjects();
fetchPercentage();


}, []);

// ================= TIMER =================
useEffect(() => {
const interval = setInterval(() => {
setTimeLeft((prev) => {
if (prev <= 1) {
clearInterval(interval);
localStorage.removeItem("token");
window.location.href = "/";
return 0;
}
return prev - 1;
});
}, 1000);


return () => clearInterval(interval);


}, []);

const formatTime = () => {
const min = Math.floor(timeLeft / 60);
const sec = timeLeft % 60;
return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

const getColor = (p) => {
if (p >= 75) return "bg-green-500";
if (p >= 50) return "bg-yellow-500";
return "bg-red-500";
};

return ( <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6"> <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-lg">


    {/* NAVBAR */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">ATTENDANCE APP</h2>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          ⏳ {formatTime()}
        </span>

        <button
          onClick={clearAllData}
          className="bg-red-500 text-white px-3 py-2 rounded-lg"
        >
          Clear Data
        </button>

        <button
          onClick={logout}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>

    {/* ADD SUBJECT */}
    <div className="flex gap-2 mb-6">
      <input
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
        placeholder="Enter subject"
        className="flex-1 border p-2 rounded"
      />
      <button
        onClick={addSubject}
        className="bg-blue-500 text-white px-4 rounded"
      >
        Add
      </button>
    </div>

    {/* SUBJECT LIST */}
    <div className="space-y-4 mb-6">
      {subjects.map((subj, index) => (
        <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
          <span className="font-semibold">{subj}</span>

          <div className="flex gap-2">
            <button onClick={() => deleteSubject(subj)} className="bg-gray-700 text-white px-3 py-1 rounded">
              Delete
            </button>

            <button onClick={() => markAttendance("Present", subj)} className="bg-green-500 text-white px-3 py-1 rounded">
              Present
            </button>

            <button onClick={() => markAttendance("Absent", subj)} className="bg-red-500 text-white px-3 py-1 rounded">
              Absent
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* SUMMARY */}
    <div className="grid grid-cols-3 gap-4 mb-6 text-center">
      <div className="bg-blue-100 p-4 rounded">
        <p className="font-bold">{summary.total_days}</p>
        <p>Total</p>
      </div>
      <div className="bg-green-100 p-4 rounded">
        <p className="font-bold">{summary.present}</p>
        <p>Present</p>
      </div>
      <div className="bg-red-100 p-4 rounded">
        <p className="font-bold">{summary.absent}</p>
        <p>Absent</p>
      </div>
    </div>

    {/* 🔥 PERCENTAGE UI */}
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-3">ATTENDANCE %</h3>

      <div className="space-y-3">
        {percentage.map((item, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded">

            <div className="flex justify-between mb-1">
              <span>{item.subject}</span>
              <span>{item.percentage}%</span>
            </div>

            <div className="w-full bg-gray-300 rounded h-2">
              <div
                className={`${getColor(item.percentage)} h-2 rounded`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>

          </div>
        ))}
      </div>
    </div>

    {/* RECORDS */}
    <div>
      <h4 className="text-xl font-semibold mb-2">ATTENDANCE RECORDS</h4>

      <ul className="space-y-2">
        {attendance.map((item, index) => (
          <li key={index} className="flex justify-between bg-gray-100 p-3 rounded">
            <div>
              <span className="font-medium">{item.subject}</span>
              <span className="text-gray-500 ml-2">- {item.date}</span>
            </div>

            <span className={item.status === "Present" ? "text-green-600" : "text-red-600"}>
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </div>

  </div>
</div>


);
}

export default Dashboard;
