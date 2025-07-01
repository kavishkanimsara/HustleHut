import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export function generateAttendancePdf(attendanceData, fromDate, toDate) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Attendance Table", 14, 20);

  const filtered = attendanceData.filter((entry) => {
    const entryDate = dayjs(entry.date);
    return (
      entryDate.isAfter(dayjs(fromDate).subtract(1, "day")) &&
      entryDate.isBefore(dayjs(toDate).add(1, "day"))
    );
  });

  const tableBody = filtered.map((entry, index) => [
    index + 1,
    entry.date,
    entry.status,
    entry.checkIn || "-",
    entry.checkOut || "-",
  ]);

  autoTable(doc, {
    startY: 30,
    head: [["#", "Date", "Status", "Check In", "Check Out"]],
    body: tableBody,
    styles: { halign: "center" },
    headStyles: { fillColor: [22, 160, 133] },
  });

  doc.save(`attendance_${fromDate}_to_${toDate}.pdf`);
}
