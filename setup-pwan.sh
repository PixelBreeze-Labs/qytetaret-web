#!/bin/bash

echo "Starting clean PWA structure modification..."

# 1. Remove unnecessary structures
rm -rf src/app/\(studio\)

# 2. Add PWA routes under (site)
mkdir -p src/app/\(site\)/reports/new
mkdir -p src/app/\(site\)/reports/\[id\]

# 3. Create PWA pages
touch src/app/\(site\)/reports/page.tsx
touch src/app/\(site\)/reports/new/page.tsx
touch src/app/\(site\)/reports/\[id\]/page.tsx

# 4. Add basic content to pages
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

echo "✅ PWA structure added successfully!"
