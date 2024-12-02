#!/bin/bash

# First clean up everything that might conflict
echo "Cleaning up old structure..."
rm -rf src/app/page.tsx
rm -rf src/app/reports
rm -rf src/lemonSqueezy
rm -rf src/paddle
rm -rf src/pricing
rm -rf src/sanity
rm -rf src/stripe
rm -rf src/staticData
rm -rf src/components/GlobalSearch
rm -rf src/components/Pricing
rm -rf src/components/Blog
rm -rf src/components/Stripe
rm -rf prisma

# Create new PWA structure
echo "Creating new PWA structure..."

# Create app routes under (site)
mkdir -p src/app/\(site\)/reports/new
mkdir -p src/app/\(site\)/reports/\[id\]

# Create core components structure
mkdir -p src/components/{layouts,shared,reports,ui}

# Create utility folders
mkdir -p src/lib/{api,utils}
mkdir -p src/types

# Create base pages
echo "Creating base pages..."
cat > src/app/\(site\)/page.tsx << 'EOF'
export default function HomePage() {
 return (
   <div>
     <h1>Qytetaret Feed</h1>
   </div>
 )
}
EOF

cat > src/app/\(site\)/reports/page.tsx << 'EOF'
export default function ReportsPage() {
 return (
   <div>
     <h1>Reports List</h1>
   </div>
 )
}
EOF

cat > src/app/\(site\)/reports/new/page.tsx << 'EOF'
export default function NewReportPage() {
 return (
   <div>
     <h1>Create New Report</h1>
   </div>
 )
}
EOF

cat > src/app/\(site\)/reports/\[id\]/page.tsx << 'EOF'
export default function ReportDetailPage({ params }: { params: { id: string } }) {
 return (
   <div>
     <h1>Report Detail {params.id}</h1>
   </div>
 )
}
EOF

# Create component files
echo "Creating component files..."
touch src/components/layouts/Header.tsx
touch src/components/layouts/Footer.tsx
touch src/components/shared/ReportCard.tsx
touch src/components/reports/ReportForm.tsx
touch src/components/reports/ReportList.tsx
touch src/components/ui/{Button,Input,Card}.tsx

# Create type definitions
echo "Creating type definitions..."
cat > src/types/report.ts << 'EOF'
export interface Report {
 id: string;
 title: string;
 description: string;
 location: {
   type: string;
   coordinates: [number, number];
 };
 category: string;
 status: 'pending' | 'in_progress' | 'resolved' | 'closed';
 media?: string[];
 createdAt: Date;
 updatedAt: Date;
}
EOF

# Create API utilities
echo "Creating API utilities..."
cat > src/lib/api/reports.ts << 'EOF'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getReports() {
 const res = await fetch(`${API_URL}/reports`);
 return res.json();
}

export async function getReport(id: string) {
 const res = await fetch(`${API_URL}/reports/${id}`);
 return res.json();
}
EOF

# Create constants
cat > src/lib/utils/constants.ts << 'EOF'
export const REPORT_CATEGORIES = [
 'infrastructure',
 'safety',
 'environment',
 'community',
 'other'
];

export const REPORT_STATUS = {
 pending: 'Pending',
 in_progress: 'In Progress',
 resolved: 'Resolved',
 closed: 'Closed'
};
EOF

echo "✅ PWA structure created successfully!"
echo "🚀 Ready to start implementing features!"
