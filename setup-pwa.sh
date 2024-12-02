#!/bin/bash

# Setup main app structure
mkdir -p src/app/\(site\)/{reports/\[id\],reports/new}

# Setup components structure
mkdir -p src/components/{layouts,shared,reports,ui}

# Create main pages
touch src/app/\(site\)/page.tsx                     # Home/Feed
touch src/app/\(site\)/reports/page.tsx             # Reports List
touch src/app/\(site\)/reports/new/page.tsx         # Create Report
touch src/app/\(site\)/reports/\[id\]/page.tsx      # Report Detail

# Create core components
touch src/components/layouts/Header.tsx
touch src/components/layouts/Footer.tsx
touch src/components/shared/ReportCard.tsx
touch src/components/reports/ReportForm.tsx
touch src/components/reports/ReportList.tsx

# Create UI components
touch src/components/ui/Button.tsx
touch src/components/ui/Input.tsx
touch src/components/ui/Card.tsx

# Create types and utilities
mkdir -p src/types
mkdir -p src/lib/{api,utils}
touch src/types/report.ts
touch src/lib/api/reports.ts
touch src/lib/utils/constants.ts

echo "Created PWA structure based on PRD!"
