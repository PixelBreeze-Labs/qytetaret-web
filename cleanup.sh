#!/bin/bash

# Clean up unnecessary directories and files
rm -rf src/lemonSqueezy
rm -rf src/paddle
rm -rf src/pricing
rm -rf src/sanity
rm -rf src/stripe
rm -rf src/staticData
rm -rf prisma

# Clean up components we don't need
rm -rf src/components/GlobalSearch
rm -rf src/components/Pricing
rm -rf src/components/Blog
rm -rf src/components/Stripe

# Create new structure for Qytetaret PWA
mkdir -p src/app/reports/{new,\[id\]}
mkdir -p src/app/\(auth\)/{login,register}
mkdir -p src/lib/{api,types,hooks}
mkdir -p src/components/{ui,shared}

# Create base files
touch src/app/page.tsx
touch src/app/reports/page.tsx
touch src/app/reports/new/page.tsx
touch src/app/reports/\[id\]/page.tsx
touch src/app/\(auth\)/login/page.tsx
touch src/app/\(auth\)/register/page.tsx

# Create necessary lib files
touch src/lib/api/reports.ts
touch src/lib/types/reports.ts
touch src/lib/hooks/useReports.ts

# Create basic components
touch src/components/ui/Button.tsx
touch src/components/ui/Card.tsx
touch src/components/ui/Input.tsx
touch src/components/shared/ReportCard.tsx
touch src/components/shared/ReportForm.tsx

# Keep manifest and PWA configs
mkdir -p public/icons

echo "Project cleaned and restructured for Qytetaret PWA!"
