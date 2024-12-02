const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getReports() {
 const res = await fetch(`${API_URL}/reports`);
 return res.json();
}

export async function getReport(id: string) {
 const res = await fetch(`${API_URL}/reports/${id}`);
 return res.json();
}
