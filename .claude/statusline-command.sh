#!/bin/bash
# EventSync Status Check
echo "=== EventSync Status ==="
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo "Files: $(find src -name '*.tsx' -o -name '*.ts' | wc -l) TypeScript files"
echo "Components: $(find src/components -name '*.tsx' 2>/dev/null | wc -l) components"
echo "Pages: $(find src/app -name 'page.tsx' | wc -l) pages"
echo "API Routes: $(find src/app/api -name 'route.ts' 2>/dev/null | wc -l) routes"
echo "========================"
