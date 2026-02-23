#!/bin/bash
# ===========================================
# EventSync — Full Project Bootstrap
# ===========================================
# Run: chmod +x bootstrap.sh && ./bootstrap.sh

set -e
echo "🚀 Bootstrapping EventSync..."

# 1. Create Next.js app
echo "📦 [1/6] Creating Next.js project..."
npx create-next-app@latest . \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --no-git

# 2. Core dependencies
echo "📦 [2/6] Installing core dependencies..."
npm install \
  @supabase/supabase-js @supabase/ssr \
  @google/generative-ai \
  @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid \
  @fullcalendar/timegrid @fullcalendar/interaction @fullcalendar/list \
  framer-motion \
  lucide-react \
  recharts \
  react-hook-form @hookform/resolvers zod \
  zustand \
  date-fns \
  ics \
  papaparse \
  clsx tailwind-merge class-variance-authority \
  next-themes \
  sonner \
  cmdk \
  vaul \
  chroma-js \
  bcryptjs \
  qrcode \
  canvas-confetti \
  uuid

# 3. Dev dependencies
echo "📦 [3/6] Installing dev dependencies..."
npm install -D \
  @types/papaparse \
  @types/chroma-js \
  @types/bcryptjs \
  @types/qrcode \
  @types/canvas-confetti \
  @types/uuid \
  prettier prettier-plugin-tailwindcss

# 4. shadcn/ui setup
echo "🎨 [4/6] Setting up shadcn/ui..."
npx shadcn@latest init -d

# 5. Add shadcn components
echo "🎨 [5/6] Adding UI components..."
npx shadcn@latest add \
  button card dialog dropdown-menu input label select tabs \
  badge avatar calendar popover command sheet separator skeleton \
  switch textarea tooltip scroll-area alert-dialog form checkbox \
  radio-group progress collapsible table toggle-group slider

# 6. Create directories
echo "📂 [6/6] Creating project structure..."
mkdir -p src/components/{ui,layout,calendar,events,dashboard,ai,theme,team,notifications,share,common}
mkdir -p src/lib/{supabase,ai/{prompts,agents},utils,validators,constants,hooks}
mkdir -p src/types
mkdir -p src/styles
mkdir -p public/{icons/events,illustrations}

# Create utility files
cat > src/lib/utils/cn.ts << 'ENDOFFILE'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
ENDOFFILE

echo ""
echo "✅ EventSync scaffolded successfully!"
echo ""
echo "📋 Next steps:"
echo "  1. cp .env.example .env.local"
echo "  2. Fill in Supabase + Anthropic keys"
echo "  3. Run the SQL schema in Supabase SQL Editor"
echo "  4. npm run dev"
echo ""
echo "🏆 Let's win this competition!"
